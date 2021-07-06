/* eslint valid-jsdoc: "off" */

"use strict";

const userConfig = require("./user.default");

module.exports = (appInfo) => {
  const config = (exports = {});

  config.keys = appInfo.name + "_1619763362965_1117";

  config.middleware = [];

  config.httpclient = {
    request: {
      timeout: 10000,
    },
  };

  config.multipart = {
    mode: "file",
    fileSize: "5mb",
    files: 20,
    fieldSize: "1mb",
    fields: 20,
    fileExtensions: [".png,.jpg,.jpeg,.svg"],
  };

  config.onerror = {
    all() {
      return false;
    },
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.middleware = ["authorization", "router", "log"];

  config.redis = {
    clients: {
      market: {
        port: 6379,
        host: "127.0.0.1",
        password: null,
        db: 10,
      },
      kline: {
        port: 6379,
        host: "127.0.0.1",
        password: null,
        db: 11,
      },
      common: {
        port: 6379,
        host: "127.0.0.1",
        password: null,
        db: 12,
      },
      subscription: {
        port: 6379,
        host: "127.0.0.1",
        password: null,
        db: 13,
      },
    },
  };

  config.sequelize = {
    dialect: "mysql",
    dialectOptions: {
      charset: "utf8mb4",
    },
    database: "korn",
    host: "127.0.0.1",
    port: "3306",
    username: "root",
    password: "", // mysql 数据库密码
    timezone: "+08:00",
    logging() {
      // console.log(args[0]);
      // console.log("");
    },
  };

  const customConfig = {
    ...userConfig,
  };

  return {
    ...config,
    ...customConfig,
  };
};
