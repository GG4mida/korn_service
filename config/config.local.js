/* eslint-disable */

"use strict";

const userConfig = require("./user.local");

module.exports = () => {
  const config = (exports = {});

  config.sequelize = {
    dialect: "mysql",
    dialectOptions: {
      charset: "utf8mb4",
    },
    database: "korn",
    host: "127.0.0.1",
    port: "3306",
    username: "root",
    password: "", 
    timezone: "+08:00",
    logging(...args) {
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
