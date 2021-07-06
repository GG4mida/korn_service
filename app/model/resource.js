"use strict";

const { String, DateTime } = require("../util");

module.exports = (app) => {
  const { Sequelize } = app;
  const { STRING, DATE } = Sequelize;

  const Resource = app.model.define(
    "Resource",
    {
      id: {
        type: STRING(32),
        primaryKey: true,
        allowNull: false,
        defaultValue: String.getDbId,
        comment: "编号",
      },
      name: {
        type: STRING(64),
        allowNull: false,
        comment: "标题",
      },
      path: {
        type: STRING(256),
        comment: "路径",
      },
      url: {
        type: STRING(256),
        comment: "描述",
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
      tableName: "korn_resource",
      timestamps: false,
    }
  );

  return Resource;
};
