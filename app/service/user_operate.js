"use strict";

const BaseService = require("./base");

class UserOperateService extends BaseService {
  constructor(props) {
    super(props);
    this.model = this.ctx.model.UserOperate;
  }
}

module.exports = UserOperateService;
