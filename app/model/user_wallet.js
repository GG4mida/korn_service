"use strict";

const { String, DateTime } = require("../util");

module.exports = (app) => {
  const { Sequelize } = app;

  const { STRING, DATE, DECIMAL } = Sequelize;

  const UserWallet = app.model.define(
    "UserWallet",
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
        unique: true,
        comment: "用户编号",
      },
      balance_init: {
        type: DECIMAL(24, 4),
        defaultValue: 0,
        allowNull: false,
        comment: "初始余额",
      },
      balance_current: {
        type: DECIMAL(24, 4),
        defaultValue: 0,
        allowNull: false,
        comment: "当前余额",
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
      tableName: "korn_user_wallet",
      timestamps: false,
    }
  );

  return UserWallet;
};
