"use strict";

const BaseService = require("./base");

class AdminLogService extends BaseService {
  constructor(props) {
    super(props);
    this.model = this.ctx.model.AdminLog;
  }
}

module.exports = AdminLogService;
