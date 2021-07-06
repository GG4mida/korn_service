"use strict";

const { Op } = require("sequelize");
const BaseController = require("./base");
const { DateTime } = require("../util");
const { UserValidator } = require("../validator");

class UserController extends BaseController {
  async info() {
    const userToken = this.getToken();
    const userBaseInfo = await this.ctx.service.user.getBaseInfo(userToken);
    await this.responseSuccessJson(userBaseInfo);
  }

  async holds() {
    const userToken = this.getToken();
    const userHoldList = await this.ctx.service.user.getHoldList(userToken);
    await this.responseSuccessJson(userHoldList);
  }

  async operates() {
    const userToken = this.getToken();
    const userOperateList = await this.ctx.service.user.getOperateList(
      userToken
    );
    await this.responseSuccessJson(userOperateList);
  }

  async update() {
    const { body: userData } = this.ctx.request;
    const userValidateRes = UserValidator.validator(userData);

    if (userValidateRes) {
      await this.responseFailedJson(userValidateRes);
      return;
    }

    const userToken = this.getToken();
    const userBaseInfo = await this.ctx.service.user.getBaseInfo(userToken);

    const { id: userId } = userBaseInfo;

    const { nickname, email, avatar } = userData;

    const userConfigExistCondition = {
      nick_name: nickname,
      user_id: {
        [Op.ne]: userId,
      },
    };

    const userConfigExistInfo =
      await this.ctx.service.userConfig.getOneByCondition(
        userConfigExistCondition
      );
    if (userConfigExistInfo) {
      await this.responseFailedJson("昵称已被占用");
      return;
    }

    const userConfigUpdateData = {
      nick_name: nickname,
      email,
      avatar,
      updatetime: DateTime.getCurrentDateTime(),
    };

    const userConfigUpdateCondition = {
      user_id: userId,
    };

    const userConfigUpdateRes = await this.ctx.service.userConfig.update(
      userConfigUpdateData,
      userConfigUpdateCondition
    );

    if (!userConfigUpdateRes) {
      await this.responseFailedJson("更新个人信息失败，请稍候重试");
      return;
    }

    await this.responseSuccessJson("更新个人信息成功");
  }

  async reset() {
    const userToken = this.getToken();
    const userBaseInfo = await this.ctx.service.user.getBaseInfo(userToken);
    const { id: userId } = userBaseInfo;

    const userResetCondition = {
      user_id: userId,
    };

    // 清空用户持仓
    await this.ctx.service.userHold.delete(userResetCondition);

    // 清空用户记录
    await this.ctx.service.userOperate.delete(userResetCondition);

    // 清空用户自选
    await this.ctx.service.userFavorite.delete(userResetCondition);

    // 初始用户钱包
    const systemConfigInfo = await this.getSystemInfo();
    const { user_default_balance } = systemConfigInfo;
    const userWalletResetData = {
      balance_init: user_default_balance,
      balance_current: user_default_balance,
      updatetime: DateTime.getCurrentDateTime(),
    };
    await this.ctx.service.userWallet.update(
      userWalletResetData,
      userResetCondition
    );

    await this.responseSuccessJson("重置账户信息成功");
  }
}

module.exports = UserController;
