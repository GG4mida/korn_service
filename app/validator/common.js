"use strict";

const validator = (reg) => (data) => reg.test(data);

const usernameValidator = validator(/^[a-zA-Z0-9_@.*#-]{5,30}$/i);
const nicknameValidator = validator(/^[\u4E00-\u9FA5A-Za-z0-9_]+$/i);
const passwordValidator = validator(/^[a-zA-Z0-9_@.*#-]{6,30}$/i);
const emailValidator = validator(
  /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/i
);
const urlValidator = validator(
  /^(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i
);

const numberValidator = (number) => {
  return Number(number + "") > 0;
};

module.exports = {
  usernameValidator,
  nicknameValidator,
  passwordValidator,
  numberValidator,
  emailValidator,
  urlValidator,
};
