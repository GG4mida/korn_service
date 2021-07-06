"use strict";

const { String } = require("../util");

module.exports = (app) => {
  const { Sequelize } = app;

  const { STRING, FLOAT } = Sequelize;

  const SystemConfig = app.model.define(
    "SystemConfig",
    {
      id: {
        type: STRING(32),
        primaryKey: true,
        allowNull: false,
        defaultValue: String.getDbId,
        comment: "编号",
      },
      name: {
        type: STRING(32),
        allowNull: false,
        unique: true,
        comment: "系统名称",
      },
      url: {
        type: STRING(128),
        comment: "接口地址",
      },
      site_url: {
        type: STRING(128),
        comment: "官网地址",
      },
      git_url: {
        type: STRING(128),
        comment: "Git地址",
      },
      logo: {
        type: STRING(128),
        allowNull: false,
        comment: "系统图片",
      },
      slogan: {
        type: STRING(64),
        allowNull: false,
        comment: "系统 slogan",
      },
      description: {
        type: STRING(256),
        comment: "系统描述",
      },
      email: {
        type: STRING(64),
        defaultValue: "",
        comment: "官方邮箱",
      },
      wechat: {
        type: STRING(64),
        defaultValue: "",
        comment: "官方微信",
      },
      telegram: {
        type: STRING(64),
        defaultValue: "",
        comment: "官方电报",
      },
      user_default_balance: {
        type: FLOAT,
        defaultValue: 100000,
        comment: "商户默认余额",
      },
    },
    {
      tableName: "korn_system_config",
      timestamps: false,
    }
  );

  return SystemConfig;
};
