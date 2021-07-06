"use strict";

const BaseController = require("./base");

class MarketController extends BaseController {
  async get() {
    const marketInfo = await this.ctx.service.market.getList();
    await this.responseSuccessJson(marketInfo);
  }
}

module.exports = MarketController;
