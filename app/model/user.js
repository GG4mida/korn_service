"use strict";

const { DateTime, String, Encryptor } = require("../util");

module.exports = (app) => {
  const { Sequelize } = app;
  const { STRING, DATE, BOOLEAN } = Sequelize;

  const User = app.model.define(
    "User",
    {
      id: {
        type: STRING(32),
        primaryKey: true,
        allowNull: false,
        defaultValue: String.getDbId,
        comment: "编号",
      },
      login_name: {
        type: STRING(32),
        allowNull: false,
        unique: true,
        comment: "登录名",
      },
      login_pwd: {
        type: STRING(128),
        allowNull: false,
        set(value) {
          this.setDataValue("login_pwd", Encryptor.sha256(value));
        },
        comment: "登录密码",
      },
      createtime: {
        type: DATE,
        defaultValue: DateTime.getCurrentDateTime,
        get() {
          return DateTime.formatDateTime(this.getDataValue("createtime"));
        },
        comment: "创建时间",
      },
      enabled: {
        type: BOOLEAN,
        defaultValue: true,
        comment: "是否启用",
      },
      remark: {
        type: STRING(128),
        defaultValue: "",
        comment: "备注信息",
      },
    },
    {
      tableName: "korn_user",
      timestamps: false,
    }
  );

  return User;
};
