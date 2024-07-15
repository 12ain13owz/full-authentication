const config = require("config");
const { sign, verify } = require("jsonwebtoken");
const { newError } = require("./helper");
const log = require("./logger");

const sighJwt = (object, keyName, options) => {
  try {
    const privateKey = config.get(keyName);
    const token = sign(object, privateKey, {
      algorithm: "RS256",
      ...(options && options),
    });

    return token;
  } catch (error) {
    throw newError(403, `sighJwt - ${error.message}`);
  }
};

const signAccessToken = (userId) => {
  try {
    const accessToken = sighJwt({ userId }, "accessTokenPrivateKey", {
      expiresIn: "1d",
    });

    return accessToken;
  } catch (error) {
    throw newError(403, `signAccessToken, ${error.message}`);
  }
};

const signRefreshToken = (userId) => {
  try {
    const refreshToken = sighJwt({ userId }, "refreshTokenPrivateKey", {
      expiresIn: "7d",
    });

    return refreshToken;
  } catch (error) {
    throw newError(403, `signRefreshToken, ${error.message}`);
  }
};

const verifyJwt = (token, keyName) => {
  try {
    const publicKey = config.get(keyName);
    const decoded = verify(token, publicKey);

    return decoded;
  } catch (error) {
    throw newError(403, `verifyJwt, ${error.message}`);
  }
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyJwt,
};
