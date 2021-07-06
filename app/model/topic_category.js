"use strict";
const { String, DateTime } = require("../util");
module.exports = (app) => {
  const { Sequelize } = app;
  const { STRING, DATE, TEXT, BOOLEAN, TINYINT } = Sequelize;

  const TopicCategory = app.model.define(
    "TopicCategory",
    {
      id: {
        type: STRING(32),
        primaryKey: true,
        allowNull: false,
        defaultValue: String.getDbId,
        comment: "编号",
      },
      name: {
        type: STRING(256),
        allowNull: false,
        unique: true,
        comment: "名称",
      },
      description: {
        type: TEXT,
        allowNull: false,
        comment: "描述",
      },
      icon: {
        type: STRING(512),
        allowNull: false,
        comment: "图标",
      },
      order: {
        type: TINYINT,
        defaultValue: 1,
        comment: "排序",
      },
      enabled: {
        type: BOOLEAN,
        defaultValue: true,
        comment: "是否启用",
        get() {
          return this.getDataValue("enabled") === true ? 1 : 0;
        },
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
      tableName: "korn_topic_category",
      timestamps: false,
    }
  );

  return TopicCategory;
};
