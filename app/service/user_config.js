"use strict";

const BaseService = require("./base");

class UserConfigService extends BaseService {
  constructor(props) {
    super(props);
    this.model = this.ctx.model.UserConfig;
  }
}

module.exports = UserConfigService;
