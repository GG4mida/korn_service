"use strict";

const { Subscription } = require("egg");

class NewsTask extends Subscription {
  static get schedule() {
    return {
      interval: "300s",
      type: "worker",
      disable: false,
      immediate: true,
    };
  }

  async subscribe() {
    await this.ctx.service.news.request();
    return "ok";
  }
}
module.exports = NewsTask;
