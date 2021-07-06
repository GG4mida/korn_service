"use strict";

const BaseService = require("./base");

class UserWalletService extends BaseService {
  constructor(props) {
    super(props);
    this.model = this.ctx.model.UserWallet;
  }
}

module.exports = UserWalletService;
