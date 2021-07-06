"use strict";

const BaseAdminController = require("./base");

class AdminSystemController extends BaseAdminController {

  async statistic() {
    await this.responseSuccessJson("ok");
  }

  async info() {
    const adminInfo = await this.getAdminInfo();
    if (!adminInfo) {
      await this.responseFailedJson("非法请求");
      return;
    }

    const siteConfig = await this.getSystemInfo();
    await this.responseSuccessJson(siteConfig);
  }

  async update() {
    const adminData = await this.getAdminInfo();
    if (!adminData) {
      await this.responseFailedJson("非法请求");
      return;
    }
    const {
      name,
      url,
      site_url,
      git_url,
      logo,
      slogan,
      description,
      email,
      wechat,
      telegram,
      user_default_balance,
    } = this.ctx.request.body;

    const systemUpdateData = {
      name,
      url,
      site_url,
      git_url,
      logo,
      slogan,
      description,
      email,
      wechat,
      telegram,
      user_default_balance,
    };

    const systemInfo = await this.getSystemInfo();

    const { id } = systemInfo;

    const systemUpdateRes = await this.ctx.service.systemConfig.updateById(
      systemUpdateData,
      id
    );
    if (!systemUpdateRes) {
      await this.responseFailedJson("配置更新失败，请稍候重试");
      return;
    }

    await this.ctx.service.systemConfig.clearCache();

    await this.responseSuccessJson("配置更新成功");
  }
}

module.exports = AdminSystemController;
