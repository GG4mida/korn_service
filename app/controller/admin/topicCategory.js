"use strict";
const { find } = require("lodash");
const BaseAdminController = require("./base");

class AdminTopicCategoryController extends BaseAdminController {
  async list() {
    const adminInfo = await this.getAdminInfo();
    if (!adminInfo) {
      await this.responseFailedJson("非法请求");
      return;
    }
    const categoriesCondition = {};
    const categoriesOrder = [
      ["enabled", "desc"],
      ["order", "asc"],
      ["createtime", "desc"],
    ];
    const categories = await this.ctx.service.topicCategory.getListByCondition(
      categoriesCondition,
      categoriesOrder
    );

    const categoryTopicList = await this.ctx.service.topic.getGroupByAdmin();
    const categoryList = this._formatCategoryList(
      categories,
      categoryTopicList
    );

    await this.responseSuccessJson(categoryList);
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
    const topicCategoryInfo = await this.ctx.service.topicCategory.getOneById(id);
    await this.responseSuccessJson(topicCategoryInfo);
  }

  async add() {
    const adminInfo = await this.getAdminInfo();
    if (!adminInfo) {
      await this.responseFailedJson("非法请求");
      return;
    }

    const { name, description, icon, order, enabled } = this.ctx.request.body;

    if (!name || !icon) {
      await this.responseFailedJson("请求参数异常");
      return;
    }

    const topicCategoryCreateData = {
      name,
      description,
      icon,
      order,
      enabled,
    };

    const topicCategoryCreateRes = await this.ctx.service.topicCategory.create(
      topicCategoryCreateData
    );

    if (!topicCategoryCreateRes) {
      await this.responseFailedJson("新增类别失败，请稍候重试");
      return;
    }

    await this.responseSuccessJson("新增类别成功");
  }

  async edit() {
    const adminInfo = await this.getAdminInfo();
    if (!adminInfo) {
      await this.responseFailedJson("非法请求");
      return;
    }

    const { id, name, description, icon, order, enabled } =
      this.ctx.request.body;

    if (!id || !name || !icon) {
      await this.responseFailedJson("请求参数异常");
      return;
    }

    const topicCategoryEditData = {
      name,
      description,
      icon,
      order,
      enabled,
    };

    const topicCategoryEditRes =
      await this.ctx.service.topicCategory.updateById(
        topicCategoryEditData,
        id
      );

    if (!topicCategoryEditRes) {
      await this.responseFailedJson("更新类别失败，请稍候重试。");
      return;
    }

    await this.responseSuccessJson("更新类别成功。");
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

    const topicCategoryDelCondition = {
      id,
    };

    const topicCategoryDelRes = await this.ctx.service.topicCategory.delete(
      topicCategoryDelCondition
    );

    if (!topicCategoryDelRes) {
      await this.responseFailedJson("操作失败，请稍候重试");
      return;
    }

    await this.responseSuccessJson("操作成功");
  }

  _formatCategoryList(categoryList, categoryTopicList = []) {
    const result = [];
    for (const categoryItem of categoryList) {
      const { id, name, icon, description, order, enabled } = categoryItem;
      const categoryTopicItem = find(categoryTopicList, { category_id: id });
      let topicCount = 0;
      if (categoryTopicItem) {
        topicCount = categoryTopicItem.topicCount;
      }
      const item = {
        id,
        name,
        icon,
        order,
        description,
        enabled,
        topicCount,
      };
      result.push(item);
    }
    return result;
  }
}

module.exports = AdminTopicCategoryController;
