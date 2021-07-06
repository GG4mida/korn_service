"use strict";

const BaseController = require("./base");

class ExchangeController extends BaseController {
  async get() {
    const exchangeInfo = await this.ctx.service.exchange.get();
    await this.responseSuccessJson(exchangeInfo);
  }
}

module.exports = ExchangeController;
