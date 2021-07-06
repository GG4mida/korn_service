"use strict";

const BaseController = require("./base");

class TopicController extends BaseController {
  async list() {
    const { cid } = this.ctx.request.query;

    if (!cid) {
      await this.responseFailedJson("请求参数异常");
      return;
    }

    const topicCondition = {
      category_id: cid,
    };
    const topicOrder = [
      ["is_top", "desc"],
      ["order", "desc"],
      ["createtime", "desc"],
    ];

    const topicList = await this.ctx.service.topic.getListByCondition(
      topicCondition,
      topicOrder
    );

    await this.responseSuccessJson(topicList);
  }

  async categories() {
    const categoriesCondition = {
      enabled: true,
    };
    const categoriesOrder = [
      ["order", "desc"],
      ["createtime", "desc"],
    ];
    const categories = await this.ctx.service.topicCategory.getListByCondition(
      categoriesCondition,
      categoriesOrder
    );
    await this.responseSuccessJson(categories);
  }

  async detail() {
    const { id } = this.ctx.request.query;
    if (!id) {
      await this.responseFailedJson("请求参数异常");
      return;
    }

    const topicInfo = await this.ctx.service.topic.getOneById(id);
    await this.responseSuccessJson(topicInfo);
  }
}

module.exports = TopicController;
