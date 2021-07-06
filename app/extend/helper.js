"use strict";

const { Redis } = require("../constant");

const requestLimitHelper = async function(key, count) {
  const redisInstance = this.ctx.app.redis.get(Redis.REDIS_DB.COMMON);
  let requestCount = await redisInstance.get(key);
  if (!requestCount) {
    requestCount = 0;
  }

  if (requestCount >= count) {
    return "requests exceeds the limit.";
  }

  requestCount++;
  await redisInstance.set(key, requestCount);
  await redisInstance.expire(key, 600);
};

module.exports = {
  requestLimitHelper,
};
