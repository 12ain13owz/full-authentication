const config = require("config");
const Redis = require("ioredis");
const redisUrl = config.get("redisUrl");
const redis = new Redis(redisUrl);

const connectRedis = async () => {
  if (redis) return redis;

  return new Promise((resolve, reject) => {
    redis.on("error", (err) => reject(err));
    redis.on("connect", () => resolve(redis));
  });
};

module.exports = { connectRedis, redis };
