"use strict";

const BaseService = require("./base");

class SystemLogService extends BaseService {
  constructor(props) {
    super(props);
    this.model = this.ctx.model.SystemLog;
  }
}

module.exports = SystemLogService;
