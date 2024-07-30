const config = require("config");
const { newError, extractRoleNames } = require("../utils/helper");
const { verifyJwt } = require("../utils/jwt");
const userService = require("../services/user.service");
const { decrypt } = require("../utils/crypto");
const node_env = config.get("node_env");

const email = (req, res, next) => {
  res.locals.func = "Middleware > Verify > email";

  try {
    const { token } = req.body;
    if (!token) throw newError(404, "Token not found");

    const decodeToken = decodeURIComponent(token);
    const { id, email, verificationCode } = decrypt(decodeToken);

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
      throw newError(401, "No token provided", true);

    const decoded = verifyJwt(accessToken, "accessTokenPublicKey");

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

const checkRole = (roles) => {
  return (req, res, next) => {
    res.locals.func = "Middleware > Verify > checkRole";

    try {
      const userRoles = res.locals.user.Roles;
      if (!userRoles || !roles.some((role) => userRoles.includes(role)))
        throw newError(403, "Unauthorized");

      next();
    } catch (error) {
      next(error);
    }
  };
};

const recaptcha = async (req, res, next) => {
  res.locals.func = "Middleware > Verify > recaptcha";

  try {
    if (node_env === "development") return next();

    const { token } = req.body;
    if (!token && token.length <= 0)
      throw newError(400, "Turnstile token not provided");

    const secretKey = config.get("turnstileSecretKey");
    let formData = new FormData();
    formData.append("secret", secretKey);
    formData.append("response", token);

    const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    const result = await fetch(url, { body: formData, method: "POST" });
    const outcome = await result.json();

    if (!outcome.success) throw newError(400, "Invalid Turnstile token");
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { email, accessToken, isUserActive, checkRole, recaptcha };
