"use strict";

const { String, DateTime } = require("../util");

module.exports = (app) => {
  const { Sequelize } = app;

  const { STRING, DATE } = Sequelize;

  const UserConfig = app.model.define(
    "UserConfig",
    {
      id: {
        type: STRING(32),
        primaryKey: true,
        allowNull: false,
        defaultValue: String.getDbId,
        comment: "编号",
      },
      user_id: {
        type: STRING(32),
        allowNull: false,
        comment: "用户编号",
      },
      nick_name: {
        type: STRING(32),
        defaultValue: "",
        comment: "用户昵称",
      },
      phone: {
        type: STRING(32),
        defaultValue: "",
        comment: "手机号码",
      },
      email: {
        type: STRING(64),
        defaultValue: "",
        comment: "电子邮箱",
      },
      avatar: {
        type: STRING(128),
        defaultValue: "",
        comment: "用户头像",
      },
      createtime: {
        type: DATE,
        defaultValue: DateTime.getCurrentDateTime,
        get() {
          return DateTime.formatDateTime(this.getDataValue("createtime"));
        },
        comment: "创建时间",
      },
      updatetime: {
        type: DATE,
        defaultValue: DateTime.getCurrentDateTime,
        get() {
          return DateTime.formatDateTime(this.getDataValue("updatetime"));
        },
        comment: "更新时间",
      },
    },
    {
      tableName: "korn_user_config",
      timestamps: false,
    }
  );

  return UserConfig;
};
