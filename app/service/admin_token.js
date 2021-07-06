"use strict";

const BaseService = require("./base");

class AdminTokenService extends BaseService {
  constructor(props) {
    super(props);
    this.model = this.ctx.model.AdminToken;
  }
}

module.exports = AdminTokenService;
