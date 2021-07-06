"use strict";

const BaseService = require("./base");

class UserTokenService extends BaseService {
  constructor(props) {
    super(props);
    this.model = this.ctx.model.UserToken;
  }
}

module.exports = UserTokenService;
