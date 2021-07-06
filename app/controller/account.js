"use strict";

const BaseController = require("./base");
const { AccountValidator } = require("../validator");
const { String, Encryptor, DateTime, Faker } = require("../util");

class AccountController extends BaseController {
  /**
   * 用户登录
   */
  async login() {
    const { body: accountData } = this.ctx.request;
    const accountValidateRes = AccountValidator.validator(accountData);

    if (accountValidateRes) {
      await this.responseFailedJson(accountValidateRes);
      return;
    }

    const { username, password } = accountData;

    const requestLimitKey = `USER_LOGIN_COUNT_${username}`;
    const requestLimitCount = 5;
    const requestLimitRes = await this.ctx.helper.requestLimitHelper(
      requestLimitKey,
      requestLimitCount
    );

    if (requestLimitRes) {
      await this.responseFailedJson(requestLimitRes);
      return;
    }

    const userCondition = {
      login_name: username,
      login_pwd: Encryptor.sha256(password),
    };

    const userData = await this.ctx.service.user.getOneByCondition(
      userCondition
    );

    if (!userData) {
      await this.responseFailedJson("用户名或密码不正确");
      return;
    }

    const { enabled, remark, id: userId } = userData;
    if (enabled === false) {
      await this.responseFailedJson(remark || "账户已禁用");
      return;
    }

    const userTokenDeleteCondition = {
      user_id: userId,
    };

    await this.ctx.service.userToken.delete(userTokenDeleteCondition);

    const { user_token_expire_seconds } = this.ctx.app.config;

    const userToken = String.getRandomString(48);
    const userTokenExpireAt = DateTime.getFeatureDateTime(
      user_token_expire_seconds
    );

    const userTokenData = {
      user_id: userId,
      token: userToken,
      expiretime: userTokenExpireAt,
    };

    const userTokenCreateRes = await this.ctx.service.userToken.create(
      userTokenData
    );

    if (!userTokenCreateRes || !userTokenCreateRes.id) {
      await this.responseFailedJson("登录失败，请稍候重试");
      return;
    }

    const responseData = {
      token: userToken,
    };

    await this.responseSuccessJson(responseData);
  }

  /**
   * 用户注册
   */
  async signup() {
    const { body: accountData } = this.ctx.request;
    const accountValidateRes = AccountValidator.validator(accountData);

    if (accountValidateRes) {
      await this.responseFailedJson(accountValidateRes);
      return;
    }

    const { username, password } = accountData;

    const userCondition = {
      login_name: username,
    };

    const userInfo = await this.ctx.service.user.getOneByCondition(
      userCondition
    );

    if (userInfo) {
      await this.responseFailedJson("用户名已注册");
      return;
    }

    const userData = {
      login_name: username,
      login_pwd: password,
    };

    const userCreateRes = await this.ctx.service.user.create(userData);
    if (!userCreateRes || !userCreateRes.id) {
      await this.responseFailedJson("注册失败，请稍候重试");
      return;
    }

    const { id: userId } = userCreateRes;

    const systemConfigInfo = await this.ctx.service.systemConfig.getConfig();

    const { url: siteUrl } = systemConfigInfo;
    const userAvatar = `${siteUrl}${Faker.generateAvatar()}`;

    const userConfigData = {
      user_id: userId,
      nick_name: Faker.generateNickName(),
      avatar: userAvatar,
    };

    const userConfigCreateRes = await this.ctx.service.userConfig.create(
      userConfigData
    );
    if (!userConfigCreateRes || !userConfigCreateRes.id) {
      await this.responseFailedJson("注册失败，请稍候重试");
      return;
    }

    const { user_default_balance } = systemConfigInfo;

    const userWalletData = {
      user_id: userId,
      balance_init: user_default_balance,
      balance_current: user_default_balance,
    };

    const userWalletCreateRes = await this.ctx.service.userWallet.create(
      userWalletData
    );
    if (!userWalletCreateRes || !userWalletCreateRes.id) {
      await this.responseFailedJson("注册失败，请稍候重试");
      return;
    }

    await this.responseSuccessJson("注册成功，请前往登录");
  }

  /**
   * 用户注销
   */
  async logout() {
    const {
      header: { authorization: token },
    } = this.ctx.request;

    if (!token) {
      await this.responseFailedJson("请求参数异常");
      return;
    }

    const userTokenCondition = {
      token,
    };

    const userTokenDeleteRes = await this.ctx.service.userToken.delete(
      userTokenCondition
    );

    if (!userTokenDeleteRes) {
      await this.responseFailedJson("注销失败，请稍候重试");
      return;
    }

    await this.responseSuccessJson("注销成功");
  }
}

module.exports = AccountController;
