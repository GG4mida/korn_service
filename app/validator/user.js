"use strict";

const { nicknameValidator, emailValidator, urlValidator } = require("./common");

const validator = (data) => {
  const { nickname, email, avatar } = data;

  if (!nickname) {
    return "昵称不能为空";
  }

  if (!nicknameValidator(nickname)) {
    return "昵称格式错误";
  }

  if (email && !emailValidator(email)) {
    return "电子邮箱格式错误";
  }

  if (avatar && !urlValidator(avatar)) {
    return "用户头像格式错误";
  }

  return null;
};

module.exports = {
  validator,
};
