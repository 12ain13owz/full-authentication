const config = require("config");
const Redis = require("ioredis");
const { generateUniqueIdentifier } = require("./crypto");
const { newError } = require("./helper");

const redisUrl = config.get("redisUrl");
const redis = new Redis(redisUrl);

const connectRedis = async () => {
  if (redis) return redis;

  return new Promise((resolve, reject) => {
    redis.on("error", (err) => reject(err));
    redis.on("connect", () => resolve(redis));
  });
};

const addRefreshToken = async (userId, refreshToken, deviceInfo, expiresAt) => {
  try {
    const uniqueIdentifier = generateUniqueIdentifier();
    const tokenKey = `refresh_${userId}_${uniqueIdentifier}`;
    const value = JSON.stringify({
      refreshToken,
      deviceInfo,
      id: uniqueIdentifier,
    });

    await redis.set(tokenKey, value);
    await redis.expireat(tokenKey, Math.floor(expiresAt / 1000));
  } catch (error) {
    throw newError(401, `addRefreshToken, ${error.message}`);
  }
};

const getRefreshTokenById = async (userId, refreshToken) => {
  const pattern = `refresh_${userId}_*`;
  const keys = await redis.keys(pattern);

  if (keys.length === 0) return null;

  for (const key of keys) {
    const value = await redis.get(key);
    if (value && JSON.parse(value).refreshToken === refreshToken)
      return JSON.parse(value);
  }

  return null;
};

const deleteRefreshToken = async (userId) => {
  const pattern = `refresh_${userId}_*`;
  const keys = await redis.keys(pattern);

  if (keys.length === 0) return null;
  for (const key of keys) await redis.del(key);
};

const deleteRefreshTokenById = async (userId, refreshId) => {
  const key = `refresh_${userId}_${refreshId}`;
  await redis.del(key);
};

const getDevices = async (userId) => {
  const pattern = `refresh_${userId}_*`;
  const keys = await redis.keys(pattern);
  if (keys.length === 0) return [];

  const values = [];
  for (const key of keys) {
    const value = await redis.get(key);
    if (value) {
      const obj = JSON.parse(value);
      delete obj.refreshToken;
      values.push(obj);
    }
  }

  return values;
};

const getDevicesById = async (userId, refreshId) => {
  const key = `refresh_${userId}_${refreshId}`;
  const value = await redis.get(key);
  if (!value) return null;
};

module.exports = {
  connectRedis,
  addRefreshToken,
  getRefreshTokenById,
  deleteRefreshToken,
  deleteRefreshTokenById,
  getDevices,
  getDevicesById,
};
