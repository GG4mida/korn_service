"use strict";

const CommonValidator = require("./common");
const CoinValidator = require("./coin");
const KLineValidator = require("./kline");
const AccountValidator = require("./account");
const UserValidator = require("./user");

module.exports = {
  CommonValidator,
  KLineValidator,
  CoinValidator,
  UserValidator,
  AccountValidator,
};
