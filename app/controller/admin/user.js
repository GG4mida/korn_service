"use strict";

const { find } = require("lodash");
const BaseAdminController = require("./base");

class AdminUserController extends BaseAdminController {
  async list() {
    const adminInfo = await this.getAdminInfo();
    if (!adminInfo) {
      await this.responseFailedJson("非法请求");
      return;
    }
    const userList = await this.ctx.service.user.getListByAdmin();
    const userHoldList = await this.ctx.service.userHold.getListByAdmin();
    const userListData = this._formatUserList(userList, userHoldList);
    await this.responseSuccessJson(userListData);
  }

  _formatUserList(userList, userHoldList = []) {
    const result = [];
    for (const userItem of userList) {
      const { id } = userItem;
      const userHoldItem = find(userHoldList, { user_id: id });
      if (userHoldItem) {
        const { holdCount } = userHoldItem;
        userItem.holdCount = holdCount;
      } else {
        userItem.holdCount = 0;
      }
      result.push(userItem);
    }
    return result;
  }
}

module.exports = AdminUserController;
