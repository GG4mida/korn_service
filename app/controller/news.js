"use strict";

const BaseController = require("./base");

class NewsController extends BaseController {
  async get() {
    const newsData = await this.ctx.service.news.getSectionList();
    await this.responseSuccessJson(newsData);
  }

  async test() {
    const newsData = await this.ctx.service.news.request();
    await this.responseSuccessJson(newsData);
  }
}

module.exports = NewsController;
