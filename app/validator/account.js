"use strict";

const { usernameValidator, passwordValidator } = require("./common");

const validator = (data) => {
  const { username, password } = data;

  if (!username) {
    return "用户名不能为空";
  }

  if (!usernameValidator(username)) {
    return "用户名格式错误";
  }

  if (!password) {
    return "密码不能为空";
  }

  if (!passwordValidator(password)) {
    return "密码格式错误";
  }

  return null;
};

module.exports = {
  validator,
};
