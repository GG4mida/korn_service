"use strict";

const { String, DateTime } = require("../util");

module.exports = (app) => {
  const { Sequelize } = app;
  const { STRING, DATE } = Sequelize;
  const AdminLog = app.model.define(
    "AdminLog",
    {
      id: {
        type: STRING(32),
        primaryKey: true,
        allowNull: false,
        defaultValue: String.getDbId,
        comment: "编号",
      },
      admin_id: {
        type: STRING(32),
        allowNull: false,
        comment: "管理员编号",
      },
      ip: {
        type: STRING(32),
        allowNull: false,
        comment: "IP地址",
      },
      user_agent: {
        type: STRING(256),
        defaultValue: "",
        comment: "UserAgent",
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
      tableName: "korn_admin_log",
      timestamps: false,
    }
  );

  return AdminLog;
};
