"use strict";

const userConfig = require("./user.default");

const userLocalConfig = {};

module.exports = {
  ...userConfig,
  ...userLocalConfig,
};
