"use strict";

const { String, DateTime } = require("../util");

module.exports = (app) => {
  const { Sequelize } = app;
  const { STRING, DATE, TEXT, BOOLEAN, TINYINT } = Sequelize;

  const Topic = app.model.define(
    "Topic",
    {
      id: {
        type: STRING(32),
        primaryKey: true,
        allowNull: false,
        defaultValue: String.getDbId,
        comment: "编号",
      },
      title: {
        type: STRING(256),
        allowNull: false,
        comment: "标题",
      },
      summary: {
        type: STRING(1024),
        comment: "描述",
      },
      content: {
        type: TEXT,
        allowNull: false,
        comment: "内容",
      },
      category_id: {
        type: STRING(64),
        comment: "所属类别",
      },
      order: {
        type: TINYINT,
        defaultValue: 1,
        comment: "排序优先级",
      },
      is_top: {
        type: BOOLEAN,
        defaultValue: false,
        comment: "是否置顶",
        get() {
          return this.getDataValue("is_top") === true ? 1 : 0;
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
      tableName: "korn_topic",
      timestamps: false,
    }
  );

  return Topic;
};
