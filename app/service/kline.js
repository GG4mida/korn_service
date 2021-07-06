"use strict";

const { Service } = require("egg");
const { KLine, Redis } = require("../constant");

class KLineService extends Service {
  constructor(props) {
    super(props);
    this.redisInstance = this.ctx.app.redis.get(Redis.REDIS_DB.KLINE);
  }

  async request(pair, type) {
    const requestSymbol = await this._getSymbolByPair(pair);
    if (!requestSymbol) return null;

    const requestInterval = KLine.KLINE_INTERVAL[type];
    if (!requestInterval) return null;

    const requestLimit = KLine.KLINE_LIMIT[type];
    if (!requestLimit) return null;

    let requestData = null;

    const { kline_api } = this.ctx.app.config;
    const requestApi = `${kline_api}?symbol=${requestSymbol}&interval=${requestInterval}&limit=${requestLimit}`;

    try {
      const requestRes = await this.ctx.curl(requestApi, {
        dataType: "json",
      });
      requestData = requestRes.data;
      if (requestData) {
        await this.set(`${pair}_${type}`, JSON.stringify(requestData));
      }
    } catch (e) {
      console.error(e);
      this.ctx.logger.error(e.message);
    }
    return requestData;
  }

  async get(pair, type) {
    const klineInfo = await this.redisInstance.get(`${pair}_${type}`);
    if (klineInfo) return JSON.parse(klineInfo);
    return this.request(pair, type);
  }

  async set(pair, data) {
    if (pair && data) {
      await this.redisInstance.set(pair, data);
      await this.redisInstance.expire(pair, 60);
    }
  }

  async _getSymbolByPair(pair) {
    const marketInfo = await this.ctx.service.market.get(pair);
    let symbol = null;
    if (marketInfo && marketInfo.s) {
      symbol = marketInfo.s;
    }
    return symbol;
  }
}

module.exports = KLineService;
