"use strict";

const { KLine } = require("../constant");

const queryValidator = (data) => {
  const { coin, type } = data;

  if (!coin) {
    return "币种不能为空";
  }

  if (!type) {
    return "类型不能为空";
  }

  if (
    type !== KLine.KLINE_TYPE.DAY &&
    type !== KLine.KLINE_TYPE.WEEK &&
    type !== KLine.KLINE_TYPE.MONTH &&
    type !== KLine.KLINE_TYPE.YEAR &&
    type !== KLine.KLINE_TYPE.ALL
  ) {
    return "类型错误";
  }

  return null;
};

module.exports = {
  queryValidator,
};
