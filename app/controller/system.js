"use strict";

const BaseController = require("./base");
class SystemController extends BaseController {
  async init() {

    const url = "http://127.0.0.1:7070";

    const systemConfigInfo = await this.getSystemInfo(false);
    if (!systemConfigInfo) {
      const systemConfigData = {
        name: "korn",
        url,
        logo: `${url}/logo.png`,
        site_url: "https://github.com/GG4mida/korn_service",
        git_url: "https://github.com/GG4mida/korn_service",
        email: "google@gmail.com",
        slogan: "iam a lucky slogan",
        description:
          "模拟炒币（现货）、数字货币实时行情 & 资讯、最新空投信息",
        user_default_balance: 100000,
      };
      await this.ctx.service.systemConfig.create(systemConfigData);
    }

    const adminInfo = await this.ctx.service.admin.getOneByCondition();
    if (!adminInfo) {
      const adminData = {
        login_name: "admin",
        login_pwd:
          "40b1273d32be30c8a527aada1076193175e3d965d883276764f9743b6ed15326", // fuckpassword sha256 加密
        phone: "13588888888",
        nickname: "Administrator",
        remark: "超级管理员",
      };
      await this.ctx.service.admin.create(adminData);
    }

    const topicCategories = await this.ctx.service.topicCategory.getOneByCondition();
    if (!topicCategories) {

      const categories = [{
        name: "新手入门",
        description: "新手入门",
        icon: `${url}/public/topic/novice.svg`,
        order: 1,
        enabled: true,
      }, {
        name: "如何交易",
        description: "如何交易",
        icon: `${url}/public/topic/trade.svg`,
        order: 1,
        enabled: true,
      }, {
        name: "远离合约",
        description: "远离合约",
        icon: `${url}/public/topic/risk.svg`,
        order: 1,
        enabled: true,
      }, {
        name: "精选文章",
        description: "精选文章",
        icon: `${url}/public/topic/good.svg`,
        order: 1,
        enabled: true,
      }];

      for (const category of categories) {
        await this.ctx.service.topicCategory.create(category);
      }
    }

    await this.responseSuccessJson("system init successful");
  }

  async start() {
    const socketClientStatus = await this.ctx.service.socketClient.status();

    if (socketClientStatus === true) {
      await this.responseFailedJson("system already started");
      return;
    }

    await this.ctx.service.socketClient.start();

    this.responseSuccessJson("system start successful");
  }

  async info() {
    const systemInfo = await this.getSystemInfo();
    await this.responseSuccessJson(systemInfo);
  }

  async avatars() {
    const avatarList = await this.ctx.service.systemConfig.getAvatars();
    await this.responseSuccessJson(avatarList);
  }
}

module.exports = SystemController;
