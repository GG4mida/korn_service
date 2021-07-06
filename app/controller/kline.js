"use strict";

const BaseController = require("./base");
const { Market } = require("../constant");
const { KLineValidator } = require("../validator");

class KLineController extends BaseController {
  async get() {
    const { query: klineData } = this.ctx.request;
    const klineValidateRes = KLineValidator.queryValidator(klineData);

    if (klineValidateRes) {
      await this.responseFailedJson(klineValidateRes);
      return;
    }

    const { coin, type } = klineData;
    const coinCode = coin.toUpperCase();
    const coinPair = `${coinCode}${Market.MARKET_STANDARD}`;
    const klineInfo = await this.ctx.service.kline.get(coinPair, type);
    await this.responseSuccessJson(klineInfo);
  }
}

module.exports = KLineController;
