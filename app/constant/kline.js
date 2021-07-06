"use strict";

const KLINE_TYPE = {
  DAY: "DAY",
  WEEK: "WEEK",
  MONTH: "MONTH",
  YEAR: "YEAR",
  ALL: "ALL",
};

const KLINE_INTERVAL = {
  [KLINE_TYPE.DAY]: "5m", // 288
  [KLINE_TYPE.WEEK]: "30m", // 336
  [KLINE_TYPE.MONTH]: "2h", // 372
  [KLINE_TYPE.YEAR]: "12h", // 400
  [KLINE_TYPE.ALL]: "12h", // 400
};

const KLINE_LIMIT = {
  [KLINE_TYPE.DAY]: 288, // 288
  [KLINE_TYPE.WEEK]: 336, // 336
  [KLINE_TYPE.MONTH]: 372, // 372
  [KLINE_TYPE.YEAR]: 400, // 400
  [KLINE_TYPE.ALL]: 400, // 400
};

module.exports = {
  KLINE_TYPE,
  KLINE_LIMIT,
  KLINE_INTERVAL,
};
