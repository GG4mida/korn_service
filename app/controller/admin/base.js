"use strict";

const BaseController = require("../base");
const { DateTime } = require("../../util");

class BaseAdminController extends BaseController {
  constructor(props) {
    super(props);
    this.updateAdminToken();
  }

  async updateAdminToken() {
    const token = await this.getToken();
    if (!token) return;

    const { admin_token_expire_second } = this.ctx.app.config;

    const adminTokenExpireDateTime = DateTime.getFeatureDateTime(
      admin_token_expire_second
    );

    const adminTokenUpdateData = {
      updatetime: DateTime.getCurrentDateTime(),
      expiretime: adminTokenExpireDateTime,
    };

    const adminTokenUpdateCondition = {
      token,
    };

    await this.ctx.service.adminToken.update(
      adminTokenUpdateData,
      adminTokenUpdateCondition
    );
  }

  async getAdminInfo() {
    const token = await this.getToken();
    if (!token) return null;

    const adminData = await this.ctx.service.admin.getByToken(token);

    if (!adminData) {
      return null;
    }

    return adminData;
  }
}

module.exports = BaseAdminController;
