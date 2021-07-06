"use strict";

const { String, DateTime } = require("../util");

module.exports = (app) => {
  const { Sequelize } = app;

  const { STRING, DATE } = Sequelize;

  const UserToken = app.model.define(
    "UserToken",
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
      token: {
        type: STRING(64),
        allowNull: false,
        unique: true,
        comment: "token",
      },
      createtime: {
        type: DATE,
        defaultValue: DateTime.getCurrentDateTime,
        get() {
          return DateTime.formatDateTime(this.getDataValue("createtime"));
        },
        comment: "创建时间",
      },
      expiretime: {
        type: DATE,
        get() {
          return DateTime.formatDateTime(this.getDataValue("expiretime"));
        },
        comment: "过期时间",
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
      tableName: "korn_user_token",
      timestamps: false,
    }
  );

  return UserToken;
};
