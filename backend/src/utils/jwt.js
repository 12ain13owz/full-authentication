const config = require("config");
const { sign, verify } = require("jsonwebtoken");
const { newError } = require("./helper");
const log = require("./logger");

const sighJwt = (object, keyName, options) => {
  try {
    const privateKey = config.get(keyName);
    const token = sign(object, privateKey, {
      algorithm: "RS256",
      ...options,
    });

    return token;
  } catch (error) {
    throw newError(401, `sighJwt - ${error.message}`);
  }
};

const signAccessToken = (userId) => {
  try {
    const accessToken = sighJwt({ userId }, "accessTokenPrivateKey", {
      expiresIn: "15m",
    });

    return accessToken;
  } catch (error) {
    throw newError(401, `signAccessToken, ${error.message}`);
  }
};

const signRefreshToken = (userId) => {
  try {
    const refreshToken = sighJwt({ userId }, "refreshTokenPrivateKey", {
      expiresIn: "7d",
    });

    return refreshToken;
  } catch (error) {
    throw newError(401, `signRefreshToken, ${error.message}`);
  }
};

const verifyJwt = (token, keyName) => {
  try {
    const publicKey = config.get(keyName);
    const decoded = verify(token, publicKey);

    return decoded;
  } catch (error) {
    throw newError(401, `verifyJwt, ${error.message}`, true);
  }
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyJwt,
};
