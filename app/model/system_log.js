"use strict";

const { String, DateTime } = require("../util");

module.exports = (app) => {
  const { Sequelize } = app;

  const { STRING, DATE } = Sequelize;

  const SystemLog = app.model.define(
    "SystemLog",
    {
      id: {
        type: STRING(32),
        primaryKey: true,
        allowNull: false,
        defaultValue: String.getDbId,
        comment: "编号",
      },
      url: {
        type: STRING(128),
        allowNull: false,
        defaultValue: "",
        comment: "page url",
      },
      user_agent: {
        type: STRING(1024),
        defaultValue: "",
        comment: "user agent",
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
      tableName: "korn_system_log",
      timestamps: false,
    }
  );

  return SystemLog;
};
