"use strict";

const { String, DateTime } = require("../util");

module.exports = (app) => {
  const { Sequelize } = app;

  const { STRING, DATE } = Sequelize;

  const UserFavorite = app.model.define(
    "UserFavorite",
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
        defaultValue: "",
        comment: "币种代码",
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
      tableName: "korn_user_favorite",
      timestamps: false,
    }
  );

  return UserFavorite;
};
