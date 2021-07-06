"use strict";

const BaseService = require("./base");
const { Redis, Market, Coin } = require("../constant");

class CoinService extends BaseService {
  constructor(props) {
    super(props);
    this.model = this.ctx.model.Coin;
    this.redisInstance = this.ctx.app.redis.get(Redis.REDIS_DB.MARKET);
  }

  async getInfo(coinCode) {
    const systemConfig = await this.ctx.service.systemConfig.getConfig();

    if (!systemConfig) return null;

    const { url: systemUrl } = systemConfig;

    const coinLogoSvg = `${systemUrl}/public/coin/${coinCode.toLowerCase()}.svg`;
    const coinLogoPng = `${systemUrl}/public/coin/${coinCode.toLowerCase()}.png`;

    const coinInfo = require(`../blockchain/${coinCode}.json`);

    coinInfo.logo_svg = coinLogoSvg;
    coinInfo.logo_png = coinLogoPng;

    return coinInfo;
  }

  async all() {
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
      const coinInfo = await this.getInfo(marketCoin);
      if (!coinInfo) {
        continue;
      }
      result[marketCoin] = coinInfo;
    }

    return Object.values(result);
  }

  async favorites(token) {
    const userInfo = await this.ctx.service.user.getBaseInfo(token);
    const { id: userId } = userInfo;
    const userFavoritesCondition = {
      user_id: userId,
    };
    const userFavoritesOrder = [["createtime", "desc"]];
    const userFavorites =
      await this.ctx.service.userFavorite.getListByCondition(
        userFavoritesCondition,
        userFavoritesOrder
      );
    if (!userFavorites || userFavorites.length === 0) return [];

    const result = [];
    for (const favorite of userFavorites) {
      const { coin_code } = favorite;
      const coinCode = coin_code.toUpperCase();
      const coinInfo = await this.getInfo(coinCode);
      if (!coinInfo) {
        continue;
      }
      result.push(coinInfo);
    }

    return result;
  }
}

module.exports = CoinService;
