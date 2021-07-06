"use strict";

const BaseAdminController = require("./base");
const { AccountValidator } = require("../../validator");
const { String, Encryptor, DateTime } = require("../../util");

class AdminAccountController extends BaseAdminController {
  async login() {
    const { body: accountData } = this.ctx.request;
    const accountValidateRes = AccountValidator.validator(accountData);

    if (accountValidateRes) {
      await this.responseFailedJson(accountValidateRes);
      return;
    }

    const { username, password } = accountData;

    const adminCondition = {
      login_name: username,
      login_pwd: Encryptor.sha256(password),
    };

    const adminLoginData = await this.ctx.service.admin.getOneByCondition(
      adminCondition
    );

    if (!adminLoginData) {
      await this.responseFailedJson("登录名或密码不正确");
      return;
    }

    const {
      id: adminId,
      enabled: adminEnabled,
      remark: adminRemark,
    } = adminLoginData;

    if (adminEnabled === false) {
      await this.responseFailedJson(adminRemark || "账户已禁用");
      return;
    }

    const { admin_token_expire_second } = this.ctx.app.config;

    const adminTokenContent = String.getRandomString(48);
    const currentDateTime = DateTime.getCurrentDateTime();
    const expireDateTime = DateTime.getFeatureDateTime(
      admin_token_expire_second
    );

    const adminTokenData = {
      admin_id: adminId,
      token: adminTokenContent,
      updatetime: currentDateTime,
      expiretime: expireDateTime,
    };

    const adminTokenCreateRes = await this.ctx.service.adminToken.create(
      adminTokenData
    );

    if (!adminTokenCreateRes || !adminTokenCreateRes.id) {
      await this.responseFailedJson("登录失败，请稍候重试");
      return;
    }

    const adminLogData = {
      admin_id: adminId,
      ip: this.ctx.ip,
      user_agent: this.ctx.get("user-agent"),
    };

    const adminLogCreateRes = await this.ctx.service.adminLog.create(
      adminLogData
    );
    if (!adminLogCreateRes || !adminLogCreateRes.id) {
      await this.responseFailedJson("登录失败，请稍候重试");
      return;
    }
    this.responseSuccessJson(adminTokenContent);
  }

  async logout() {
    const token = await this.getToken();
    if (!token) {
      await this.responseFailedJson("请求参数异常");
      return;
    }

    const adminTokenCondition = {
      token,
    };

    const adminTokenDelRes = await this.ctx.service.adminToken.delete(
      adminTokenCondition
    );

    if (!adminTokenDelRes) {
      await this.responseFailedJson("注销失败，请稍候重试");
      return;
    }

    await this.responseSuccessJson("注销成功");
  }

  async profile() {
    const token = await this.getToken();

    if (!token) {
      return null;
    }

    const adminData = await this.ctx.service.admin.getByToken(token);
    await this.responseSuccessJson(adminData);
  }
}

module.exports = AdminAccountController;
