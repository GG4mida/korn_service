"use strict";

const { Service } = require("egg");
const { Redis, Cache } = require("../constant");

class ExchangeService extends Service {
  constructor(props) {
    super(props);
    this.redisInstance = this.ctx.app.redis.get(Redis.REDIS_DB.COMMON);
  }

  async request(from = "USD", to = "CNY") {
    const DEFAULT_EXCHANGE = "6.4342";
    const { exchange: exchangeConfig } = this.ctx.app.config;
    const { api: exchangeApi, code: exchangeCode } = exchangeConfig;

    let exchangeData = null;
    try {
      const api = `${exchangeApi}?amount=1&from=${from}&to=${to}`;
      const exchangeRes = await this.ctx.curl(api, {
        method: "GET",
        headers: {
          Authorization: `APPCODE ${exchangeCode}`,
        },
        dataType: "json",
      });

      const { data } = exchangeRes;

      exchangeData = data.result.rate;

      if (exchangeData) {
        await this.set(Cache.CACHE_KEY.EXCHANGE_DATA, exchangeData);
      }
    } catch (e) {
      this.ctx.logger.info("get exchange error.");
      this.ctx.logger.info(e);
    }

    return exchangeData || DEFAULT_EXCHANGE;
  }

  async get() {
    const exchangeData = await this.redisInstance.get(
      Cache.CACHE_KEY.EXCHANGE_DATA
    );
    if (exchangeData) return exchangeData;
    return await this.request();
  }

  async set(key, data) {
    if (key && data) {
      await this.redisInstance.set(key, data);
      await this.redisInstance.expire(key, 300);
    }
  }
}

module.exports = ExchangeService;
