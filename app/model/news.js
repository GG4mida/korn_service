"use strict";

const { String } = require("../util");

module.exports = (app) => {
  const { Sequelize } = app;
  const { STRING, DATE, INTEGER } = Sequelize;

  const News = app.model.define(
    "News",
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
      content: {
        type: STRING(1024),
        allowNull: false,
        comment: "内容",
      },
      source_id: {
        type: INTEGER,
        unique: true,
        comment: "来源id",
      },
      grade: {
        type: INTEGER,
        comment: "星级数量",
      },
      up_counts: {
        type: INTEGER,
        comment: "看涨数量",
      },
      down_counts: {
        type: INTEGER,
        allowNull: false,
        comment: "看跌数量",
      },
      createtime: {
        type: DATE,
        comment: "创建时间",
      },
    },
    {
      tableName: "korn_news",
      timestamps: false,
    }
  );

  return News;
};
