"use strict";

const { String, DateTime } = require("../util");

module.exports = (app) => {
  const { Sequelize } = app;

  const { STRING, DATE, TINYINT, DECIMAL } = Sequelize;

  const UserOperate = app.model.define(
    "UserOperate",
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
      coin_code: {
        type: STRING(32),
        allowNull: false,
        comment: "币种代码",
      },
      volumn: {
        type: DECIMAL(24, 4),
        allowNull: false,
        comment: "操作数量",
      },
      amount: {
        type: DECIMAL(24, 4),
        allowNull: false,
        comment: "操作金额",
      },
      direction: {
        type: TINYINT,
        allowNull: false,
        comment: "操作方向",
      },
      price: {
        type: DECIMAL(24, 4),
        allowNull: false,
        comment: "操作价格",
      },
      createtime: {
        type: DATE,
        defaultValue: DateTime.getCurrentDateTime,
        get() {
          return DateTime.formatDateTime(this.getDataValue("createtime"));
        },
        comment: "创建时间",
      },
    },
    {
      tableName: "korn_user_operate",
      timestamps: false,
    }
  );

  return UserOperate;
};
