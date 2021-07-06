"use strict";

const BaseAdminController = require("./base");

class AdminTopicController extends BaseAdminController {
  async list() {
    const adminInfo = await this.getAdminInfo();
    if (!adminInfo) {
      await this.responseFailedJson("非法请求");
      return;
    }

    const { cid } = this.ctx.request.query;

    if (!cid) {
      await this.responseFailedJson("请求参数异常");
      return;
    }

    const topicList = await this.ctx.service.topic.getListByAdmin(cid);
    await this.responseSuccessJson(topicList);
  }

  async categories() {
    const categoriesCondition = {};
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
    const adminInfo = await this.getAdminInfo();
    if (!adminInfo) {
      await this.responseFailedJson("非法请求");
      return;
    }
    const { id } = this.ctx.request.query;
    if (!id) {
      await this.responseFailedJson("请求参数异常");
      return;
    }
    const topicInfo = await this.ctx.service.topic.getOneById(id);

    await this.responseSuccessJson(topicInfo);
  }

  async add() {
    const adminInfo = await this.getAdminInfo();
    if (!adminInfo) {
      await this.responseFailedJson("非法请求");
      return;
    }

    const { title, content, summary, order, category_id, is_top } =
      this.ctx.request.body;

    if (!title || !content || !summary || !category_id) {
      await this.responseFailedJson("请求参数异常");
      return;
    }

    const topicCreateData = {
      title,
      content,
      summary,
      category_id,
      order,
      is_top,
    };

    const topicCreateRes = await this.ctx.service.topic.create(topicCreateData);

    if (!topicCreateRes) {
      await this.responseFailedJson("新增文章失败，请稍候重试");
      return;
    }

    await this.responseSuccessJson("新增文章成功");
  }

  async edit() {
    const adminInfo = await this.getAdminInfo();
    if (!adminInfo) {
      await this.responseFailedJson("非法请求");
      return;
    }

    const { id, title, content, summary, category_id, order, is_top } =
      this.ctx.request.body;

    if (!id || !title || !content || !summary || !category_id) {
      await this.responseFailedJson("请求参数异常");
      return;
    }

    const topicEditData = {
      title,
      content,
      summary,
      order,
      category_id,
      is_top,
    };

    const topicEditRes = await this.ctx.service.topic.updateById(
      topicEditData,
      id
    );

    if (!topicEditRes) {
      await this.responseFailedJson("更新文章失败，请稍候重试。");
      return;
    }

    await this.responseSuccessJson("更新文章成功。");
  }

  async delete() {
    const adminInfo = await this.getAdminInfo();
    if (!adminInfo) {
      await this.responseFailedJson("非法请求");
      return;
    }

    const { id } = this.ctx.request.body;
    if (!id) {
      await this.responseFailedJson("请求参数异常");
      return;
    }

    const topicDelCondition = {
      id,
    };

    const topicDelRes = await this.ctx.service.topic.delete(topicDelCondition);
    if (!topicDelRes) {
      await this.responseFailedJson("操作失败，请稍候重试");
      return;
    }
    await this.responseSuccessJson("操作成功");
  }
}

module.exports = AdminTopicController;
