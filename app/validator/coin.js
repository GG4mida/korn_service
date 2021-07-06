"use strict";

const { numberValidator } = require("./common");

const buyinValidator = (data) => {
  const { coin, amount } = data;

  if (!coin) {
    return "币种不能为空";
  }

  if (!amount) {
    return "金额不能为空";
  }

  if (!numberValidator(amount)) {
    return "金额格式错误";
  }

  return null;
};

const sellValidator = (data) => {
  const { coin, volumn } = data;

  if (!coin) {
    return "币种不能为空";
  }

  if (!volumn) {
    return "数量不能为空";
  }

  if (!numberValidator(volumn)) {
    return "数量格式错误";
  }

  return null;
};

const favoriteValidator = (data) => {
  const { coin } = data;

  if (!coin) {
    return "币种不能为空";
  }

  return null;
};

module.exports = {
  buyinValidator,
  sellValidator,
  favoriteValidator,
};
