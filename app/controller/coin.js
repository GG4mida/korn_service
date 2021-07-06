"use strict";

const BaseController = require("./base");

const { DateTime, Decimal } = require("../util");
const { Coin, Market } = require("../constant");
const { CoinValidator } = require("../validator");

class CoinController extends BaseController {
  /**
   * 列表
   */
  async list() {
    const data = await this.ctx.service.coin.all();
    await this.responseSuccessJson(data);
  }

  /**
   * 自选
   */
  async favorites() {
    const userToken = this.getToken();
    const data = await this.ctx.service.coin.favorites(userToken);
    await this.responseSuccessJson(data);
  }

  /**
   * 自选 - 新增
   */
  async favorite_add() {
    const { body: favoriteData } = this.ctx.request;
    const favoriteValidateRes = CoinValidator.favoriteValidator(favoriteData);

    if (favoriteValidateRes) {
      await this.responseFailedJson(favoriteValidateRes);
      return;
    }

    const { coin } = favoriteData;
    const coinCode = coin.toUpperCase();

    const userToken = this.getToken();
    const userInfo = await this.ctx.service.user.getBaseInfo(userToken);
    const { id: userId } = userInfo;

    const userFavoriteData = {
      user_id: userId,
      coin_code: coinCode,
    };

    const userFavoriteInfo =
      await this.ctx.service.userFavorite.getOneByCondition(userFavoriteData);
    if (userFavoriteInfo) {
      await this.responseFailedJson("请勿重复添加");
      return;
    }

    const userFavoriteCreateRes = await this.ctx.service.userFavorite.create(
      userFavoriteData
    );
    if (!userFavoriteCreateRes || !userFavoriteCreateRes.id) {
      await this.responseFailedJson("自选添加失败");
      return;
    }

    await this.responseSuccessJson("自选添加成功");
  }

  /**
   * 自选 - 删除
   */
  async favorite_del() {
    const { body: favoriteData } = this.ctx.request;
    const favoriteValidateRes = CoinValidator.favoriteValidator(favoriteData);

    if (favoriteValidateRes) {
      await this.responseFailedJson(favoriteValidateRes);
      return;
    }

    const { coin } = favoriteData;
    const coinCode = coin.toUpperCase();

    const userToken = this.getToken();
    const userInfo = await this.ctx.service.user.getBaseInfo(userToken);
    const { id: userId } = userInfo;

    const userFavoriteDeleteCondition = {
      user_id: userId,
      coin_code: coinCode,
    };

    const userFavoriteDeleteRes = await this.ctx.service.userFavorite.delete(
      userFavoriteDeleteCondition
    );
    if (!userFavoriteDeleteRes) {
      await this.responseFailedJson("自选删除失败");
      return;
    }

    await this.responseSuccessJson("自选删除成功");
  }

  /**
   * 买入
   */
  async buyin() {
    const { body: operateData } = this.ctx.request;
    const operateValidateRes = CoinValidator.buyinValidator(operateData);

    if (operateValidateRes) {
      await this.responseFailedJson(operateValidateRes);
      return;
    }

    const { coin, amount } = operateData;

    const buyinAmount = Decimal.toFixed(amount, 2);

    const coinCode = coin.toUpperCase();

    const userToken = this.getToken();

    const userInfo = await this.ctx.service.user.getBaseInfo(userToken);

    const { id: userId, balance_current } = userInfo;

    if (Decimal.gt(buyinAmount, balance_current)) {
      await this.responseFailedJson("账户余额不足");
      return;
    }

    const marketInfo = await this.ctx.service.market.get(
      `${coinCode}${Market.MARKET_STANDARD}`
    );
    if (!marketInfo) {
      await this.responseFailedJson("未获取到币种信息");
      return;
    }

    const { c: marketPrice } = marketInfo;

    const buyinVolumn = Decimal.div(buyinAmount, marketPrice);

    const userHoldCondition = {
      user_id: userId,
      coin_code: coinCode,
    };

    const userHoldInfo = await this.ctx.service.userHold.getOneByCondition(
      userHoldCondition
    );
    if (userHoldInfo) {
      const { id: userHoldId, volumn: userHoldVolumn } = userHoldInfo;
      const userHoldVolumnNew = Decimal.add(userHoldVolumn, buyinVolumn);

      const userHoldUpdateData = {
        volumn: userHoldVolumnNew,
        updatetime: DateTime.getCurrentDateTime(),
      };

      const userHoldUpdateRes = await this.ctx.service.userHold.updateById(
        userHoldUpdateData,
        userHoldId
      );
      if (!userHoldUpdateRes) {
        await this.responseFailedJson("更新持仓信息失败");
        return;
      }
    } else {
      const userHoldCreateData = {
        user_id: userId,
        coin_code: coinCode,
        volumn: buyinVolumn,
      };
      const userHoldCreateRes = await this.ctx.service.userHold.create(
        userHoldCreateData
      );
      if (!userHoldCreateRes || !userHoldCreateRes.id) {
        await this.responseFailedJson("添加持仓信息失败");
        return;
      }
    }

    const userOperateData = {
      user_id: userId,
      coin_code: coinCode,
      volumn: buyinVolumn,
      amount: buyinAmount,
      direction: Coin.COIN_OP_TYPE.BUYIN,
      price: marketPrice,
    };

    const userOperateCreateRes = await this.ctx.service.userOperate.create(
      userOperateData
    );

    if (!userOperateCreateRes || !userOperateCreateRes.id) {
      await this.responseFailedJson("添加持仓记录失败");
      return;
    }

    const userWalletBalanceNew = Decimal.toFixed(
      Decimal.minus(balance_current, amount),
      2
    );
    const userWalletUpdateCondition = {
      user_id: userId,
    };
    const userWalletUpdateData = {
      balance_current: userWalletBalanceNew,
      updatetime: DateTime.getCurrentDateTime(),
    };

    const userWalletUpdateRes = await this.ctx.service.userWallet.update(
      userWalletUpdateData,
      userWalletUpdateCondition
    );
    if (!userWalletUpdateRes) {
      await this.responseFailedJson("更新账户信息失败");
      return;
    }

    await this.responseSuccessJson("操作成功");
  }

  /**
   * 卖出
   */
  async sell() {
    const { body: operateData } = this.ctx.request;
    const operateValidateRes = CoinValidator.sellValidator(operateData);

    if (operateValidateRes) {
      await this.responseFailedJson(operateValidateRes);
      return;
    }

    const userToken = this.getToken();
    const userInfo = await this.ctx.service.user.getBaseInfo(userToken);
    const { id: userId, balance_current } = userInfo;

    const { coin, volumn } = operateData;
    const coinCode = coin.toUpperCase();

    const userHoldCondition = {
      user_id: userId,
      coin_code: coinCode,
    };

    const userHoldInfo = await this.ctx.service.userHold.getOneByCondition(
      userHoldCondition
    );
    if (!userHoldInfo) {
      await this.responseFailedJson("未获取到持仓信息");
      return;
    }

    const { id: userHoldId, volumn: userHoldVolumn } = userHoldInfo;

    if (Decimal.lt(userHoldVolumn, volumn)) {
      await this.responseFailedJson("持仓数量不足");
      return;
    }

    const marketInfo = await this.ctx.service.market.get(
      `${coinCode}${Market.MARKET_STANDARD}`
    );
    if (!marketInfo) {
      await this.responseFailedJson("未获取到币种信息");
      return;
    }

    const userHoldVolumnNew = Decimal.minus(userHoldVolumn, volumn);

    const userHoldUpdateData = {
      volumn: userHoldVolumnNew,
      updatetime: DateTime.getCurrentDateTime(),
    };

    const userHoldUpdateRes = await this.ctx.service.userHold.updateById(
      userHoldUpdateData,
      userHoldId
    );
    if (!userHoldUpdateRes) {
      await this.responseFailedJson("更新持仓信息失败");
      return;
    }

    const { c: marketPrice } = marketInfo;

    const sellAmount = Decimal.toFixed(Decimal.mul(volumn, marketPrice), 2);

    const userOperateData = {
      user_id: userId,
      coin_code: coinCode,
      volumn,
      amount: sellAmount,
      direction: Coin.COIN_OP_TYPE.SELL,
      price: marketPrice,
    };

    const userOperateCreateRes = await this.ctx.service.userOperate.create(
      userOperateData
    );

    if (!userOperateCreateRes || !userOperateCreateRes.id) {
      await this.responseFailedJson("添加持仓记录失败");
      return;
    }

    const userWalletBalanceNew = Decimal.toFixed(
      Decimal.add(balance_current, sellAmount),
      2
    );
    const userWalletUpdateCondition = {
      user_id: userId,
    };
    const userWalletUpdateData = {
      balance_current: userWalletBalanceNew,
      updatetime: DateTime.getCurrentDateTime(),
    };

    const userWalletUpdateRes = await this.ctx.service.userWallet.update(
      userWalletUpdateData,
      userWalletUpdateCondition
    );
    if (!userWalletUpdateRes) {
      await this.responseFailedJson("更新账户信息失败");
      return;
    }

    await this.responseSuccessJson("操作成功");
  }
}

module.exports = CoinController;
