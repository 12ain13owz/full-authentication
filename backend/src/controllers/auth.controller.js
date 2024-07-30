const config = require("config");
const { v4: uuidv4 } = require("uuid");
const { omit } = require("lodash");
const models = require("../models");
const userService = require("../services/user.service");
const roleService = require("../services/role.service");
const userRoleService = require("../services/user-role.service");
const {
  newError,
  normalizeUnique,
  hashPassowrd,
  comparePasswords,
  extractRoleNames,
  privateUserFields,
} = require("../utils/helper");
const send = require("../utils/mailer");
const jwt = require("../utils/jwt");
const redis = require("../utils/redis");

const tokenKey = "refreshToken";
const isProduction = config.get("node_env") === "production";

const register = async (req, res, next) => {
  res.locals.func = "Controller > Auth > register";
  const transaction = await models.sequelize.transaction();

  try {
    const email = normalizeUnique(req.body.email);
    const emailExists = await userService.findByEmail(email);
    if (emailExists) throw newError(400, "Email is already registered");

    const hash = hashPassowrd(req.body.password);
    const verificationCode = uuidv4();

    const body = {
      email: email,
      password: hash,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      avatar: req.body.avatar,
      remark: req.body.remark,
      verificationCode: verificationCode,
    };

    const user = await userService.create(body, transaction);
    const roles = await roleService.findAll();
    const userRoles = roles.map((role) => ({
      UserId: user.id,
      RoleId: role.id,
    }));

    await userRoleService.bulkCreate(userRoles, transaction);
    await transaction.commit();

    const fullname = user.firstname + " " + user.lastname;
    await send.verificationEmail(
      user.id,
      fullname,
      user.email,
      verificationCode
    );

    res.json({ message: "Please verify your Email" });
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};

const resendVerification = async (req, res, next) => {
  res.locals.func = "Controller > Auth > resendVerificationEmail";
  try {
    const email = normalizeUnique(req.body.email);
    const user = await userService.findByEmail(email);

    if (!user) throw newError(401, "Could not send email");
    if (user.verified) throw newError(400, "Email is already verified");

    const { id, verificationCode } = user.toJSON();
    const fullname = user.firstname + " " + user.lastname;

    await send.verificationEmail(id, fullname, user.email, verificationCode);

    res.json({
      message:
        "If you don't see the email in your inbox, please check your spam folder",
    });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  res.locals.func = "Controller > Auth > verifyEmail";

  try {
    const { id, email, verificationCode } = req.verificationData;
    const user = await userService.findById(id);

    if (!user) throw newError(401, "Could not verify email");
    if (user.verified) throw newError(400, "Email is already verified");
    if (user.verificationCode !== verificationCode)
      throw newError(400, "Invalid verification code");

    const body = { verified: true, verificationCode: null };
    if (email !== user.email) body.email = email;

    const [updatedRowsCount] = await userService.update(id, body);
    if (updatedRowsCount === 0) throw newError(401, "Could not verify email");

    res.json({
      message:
        "Your email has been successfully verified. You can now log in to your account.",
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  res.locals.func = "Controller > Auth > login";

  try {
    console.log(req.body);

    const email = normalizeUnique(req.body.email);
    const user = await userService.findByEmail(email);
    if (!user) throw newError(401, "Invalid email or password");

    const isValidPassword = comparePasswords(req.body.password, user.password);
    if (!isValidPassword) throw newError(401, "Invalid email or password");
    if (!user.active) throw newError(401, `${email} has been suspended`);

    const accessToken = jwt.signAccessToken(user.id);
    const refreshToken = jwt.signRefreshToken(user.id);
    const profile = {
      ...omit(user.toJSON(), privateUserFields),
      Roles: extractRoleNames(user.Roles),
    };

    const expiresDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // milliseconds * seconds * minutes * hours * days
    res.clearCookie(tokenKey);
    res.cookie(tokenKey, refreshToken, {
      path: "/",
      expires: expiresDate,
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    });

    const deviceInfo = res.locals.deviceInfo;
    await redis.addRefreshToken(user.id, refreshToken, deviceInfo, expiresDate);

    res.json({ message: "Login Successfully", accessToken, data: profile });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  res.locals.func = "Controller > Auth > logout";

  try {
    const userId = req.body?.userId;
    const refreshToken = req.cookies[tokenKey];

    if (userId && refreshToken) {
      const refreshRedis = await redis.getRefreshTokenById(
        userId,
        refreshToken
      );

      if (refreshRedis)
        await redis.deleteRefreshTokenById(userId, refreshRedis.id);
    }

    res.clearCookie(tokenKey);
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  res.locals.func = "Controller > Auth > refreshToken";

  try {
    const refreshToken = req.cookies[tokenKey];
    if (!refreshToken) throw newError(401, "No token provided (1)", true);

    const decoded = jwt.verifyJwt(refreshToken, "refreshTokenPublicKey");
    if (!decoded) throw newError(401, "No token provided (2)", true);

    const user = await userService.findById(decoded.userId);
    if (!user) throw newError(404, "User not found", true);

    const refreshRedis = await redis.getRefreshTokenById(user.id, refreshToken);
    if (!refreshRedis) throw newError(401, "No token  provided (3)", true);

    const newAccessToken = jwt.signAccessToken(user.id);
    const newRefreshToken = jwt.signRefreshToken(user.id);

    const expiresDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // milliseconds * seconds * minutes * hours * days
    res.clearCookie(tokenKey);
    res.cookie(tokenKey, newRefreshToken, {
      path: "/",
      expires: expiresDate,
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    });

    const deviceInfo = refreshRedis.deviceInfo;
    const refreshId = refreshRedis.id;

    await redis.deleteRefreshTokenById(user.id, refreshId);
    await redis.addRefreshToken(
      user.id,
      newRefreshToken,
      deviceInfo,
      expiresDate
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.clearCookie(tokenKey);
    next(error);
  }
};

const getDevices = async (req, res, next) => {
  res.locals.func = "Controller > Auth > getRefreshToken";

  try {
    const id = res.locals.userId;
    const devices = await redis.getDevices(id);

    res.json(devices);
  } catch (error) {
    next(error);
  }
};

const deleteAllDevices = async (req, res, next) => {
  try {
    const userId = res.locals.userId;
    await redis.deleteRefreshToken(userId);

    res.json({ message: "Delete all devices successfully " });
  } catch (error) {
    next(error);
  }
};

const deleteDevice = async (req, res, next) => {
  res.locals.func = "Controller > Auth > deleteDevice";

  try {
    const userId = res.locals.userId;
    const refreshId = req.params.refreshId;

    await redis.deleteRefreshTokenById(userId, refreshId);

    res.json({ message: "Delete device successfully " });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  res.locals.func = "Controller > Auth > forgotPassword";

  try {
    const email = normalizeUnique(req.body.email);
    const user = await userService.findByEmail(email);
    if (!user) throw newError(400, "Email is not registered");

    const id = user.id;
    const fullname = user.firstname + " " + user.lastname;
    const passwordResetCode = uuidv4().substring(0, 8);

    const body = {
      passwordResetCode: passwordResetCode,
      passwordExpired: new Date(Date.now() + 1000 * 60 * 60 * 1),
    };
    const [updatedRowsCount] = await userService.update(id, body);
    if (updatedRowsCount === 0)
      throw newError(400, "Failed to send reset email");

    await send.forgotPasswordEmail(email, fullname, passwordResetCode);

    res.json({
      message: "A password reset code has been sent to your email.",
      note: "If you don't see the email in your inbox, please check your spam folder. The code will expire in 60 minutes.",
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  res.locals.func = "Controller > Auth > resetPassword";

  try {
    const email = normalizeUnique(req.body.email);
    const password = req.body.password;
    const passwordResetCode = req.body.otp;

    const user = await userService.findByEmail(email);
    if (!user) throw newError(400, "Email is not registered");

    if (!user.passwordResetCode)
      throw newError(400, "Password reset code is not set for this user");
    if (user.passwordResetCode !== passwordResetCode)
      throw newError(400, "Invalid password reset code provided");

    const currentTime = new Date().getTime();
    if (!user.passwordExpired || user.passwordExpired.getTime() < currentTime)
      throw newError(
        400,
        "Password reset code has expired. Please try the 'Forgot Password' process again."
      );

    const id = user.id;
    const body = {
      password: hashPassowrd(password),
      passwordResetCode: null,
      passwordExpired: null,
    };

    const [updatedRowsCount] = await userService.update(id, body);
    if (updatedRowsCount === 0)
      throw newError(400, "User not found or can not change password");

    await redis.deleteRefreshToken(id);

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verifyEmail,
  resendVerification,
  login,
  logout,
  refreshToken,
  getDevices,
  deleteAllDevices,
  deleteDevice,
  forgotPassword,
  resetPassword,
};
