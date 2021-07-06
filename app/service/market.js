"use strict";

const { Service } = require("egg");
const { DateTime } = require("../util");
const { Cache, Coin, Market, Redis } = require("../constant");

class MarketService extends Service {
  constructor(props) {
    super(props);
    this.redisInstance = this.ctx.app.redis.get(Redis.REDIS_DB.MARKET);
  }

  async received(data) {
    if (!data) return;
    const marketList = JSON.parse(data);
    if (!marketList || marketList.length === 0) return;
    for (const market of marketList) {
      const { ps: pair } = market;
      const marketJson = JSON.stringify(market);
      await this.set(pair, marketJson);
    }
    await this.pub(data);
    await this._updateDateTime();
  }

  async set(pair, val) {
    if (pair && val) {
      await this.redisInstance.set(pair, val);
    }
  }

  async get(pair) {
    const marketInfo = await this.redisInstance.get(pair);
    return marketInfo ? JSON.parse(marketInfo) : null;
  }

  async getList() {
    const marketList = await this.redisInstance.keys("*");
    if (!marketList || marketList.length === 0) return [];

    const result = {};
    Coin.COIN_LIST.forEach((coin) => {
      result[coin] = true;
    });

    for (const market of marketList) {
      if (!market.includes(Market.MARKET_STANDARD)) {
        continue;
      }
      const marketCoin = market.slice(0, -Market.MARKET_STANDARD.length);
      if (!result[marketCoin]) {
        continue;
      }
      const marketData = await this.redisInstance.get(market);
      result[marketCoin] = JSON.parse(marketData);
    }

    return result;
  }

  async pub(market) {
    await this.redisInstance.publish(Market.MARKET_PUBLISH_CHANNEL, market);
  }

  async _updateDateTime() {
    const currentTime = DateTime.getCurrentTime();
    await this.redisInstance.set(
      Cache.CACHE_KEY.MARKET_LATEST_RECEIVED_DATETIME,
      currentTime
    );
  }
}

module.exports = MarketService;
