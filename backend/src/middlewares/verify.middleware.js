const { newError, extractRoleNames } = require("../utils/helper");
const { verifyJwt } = require("../utils/jwt");
const userService = require("../services/user.service");
const { decrypt } = require("../utils/crypto");

const email = (req, res, next) => {
  res.locals.func = "Middleware > Verify > email";

  try {
    const token = req.params.token;
    if (!token) throw newError(404, "Token not found");

    const decodeURI = decodeURIComponent(token);
    const { id, email, verificationCode } = decrypt(decodeURI);

    if (!id || !email || !verificationCode)
      throw newError(400, "Invalid verification link");

    req.verificationData = { id, email, verificationCode };
    next();
  } catch (error) {
    next(error);
  }
};

const accessToken = (req, res, next) => {
  res.locals.func = "Middleware > verify > accessToken";

  try {
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken || accessToken === "null")
      throw newError(403, "No token provided (1)", true);

    const decoded = verifyJwt(accessToken, "accessTokenPublicKey");
    if (!decoded) throw newError(403, "No token provided (2)", true);

    res.locals.userId = decoded.userId;
    next();
  } catch (error) {
    next(error);
  }
};

const isUserActive = async (req, res, next) => {
  res.locals.func = "Middleware > Verify > isUserActive";

  try {
    const user = await userService.findById(res.locals.userId);

    if (!user) throw newError(404, "User not found", true);
    if (!user.active)
      throw newError(401, `${user.email} has been suspended`, true);

    const profile = {
      ...user.toJSON(),
      Roles: extractRoleNames(user.Roles),
    };

    res.locals.user = profile;
    next();
  } catch (error) {
    next(error);
  }
};

const checkRole = (role) => {
  return (req, res, next) => {
    res.locals.func = "Middleware > Verify > checkRole";

    try {
      const roles = res.locals.user.Roles;
      if (!roles || !roles.includes(role)) throw newError(403, "Unauthorized");

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { email, accessToken, isUserActive, checkRole };
