"use strict";

const { Service } = require("egg");
const SocketClient = require("../socket/client");
const { DateTime } = require("../util");
const { Cache, Redis } = require("../constant");

class SocketClientService extends Service {
  constructor(props) {
    super(props);
    this.redisInstance = this.ctx.app.redis.get(Redis.REDIS_DB.MARKET);
  }

  async handleMessage(data) {
    this.ctx.service.market.received(data);
  }

  async status() {
    const clientLatestReceivedDateTime = await this.redisInstance.get(
      Cache.CACHE_KEY.MARKET_LATEST_RECEIVED_DATETIME
    );
    if (!clientLatestReceivedDateTime) return false;

    const currentDateTime = DateTime.getCurrentTime();
    const clientAliveThresholdSeconds = 1000 * 5;

    return (
      currentDateTime - clientLatestReceivedDateTime <
      clientAliveThresholdSeconds
    );
  }

  async start() {
    const { market_api } = this.ctx.app.config;
    SocketClient.address = market_api;
    SocketClient.messageHandler = (data) => this.handleMessage(data);
    SocketClient.start();
  }
}

module.exports = SocketClientService;
