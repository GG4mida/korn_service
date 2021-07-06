"use strict";

module.exports = {
  admin_token_expire_second: 3600 * 24,
  user_token_expire_seconds: 3600 * 24 * 365 * 10,
  market_api: "wss://dstream.binance.com/ws/!ticker@arr",
  kline_api: "https://dapi.binance.com/dapi/v1/klines",
  exchange: {
    api: "https://jisuhuilv.market.alicloudapi.com/exchange/convert",
    code: "",
  },
  news: {
    api: "http://api.coindog.com/live/list",
    accessKey: "",
    secretKey: "",
  },
  topic: {
    api: "http://api.coindog.com/topic/list",
    accessKey: "",
    secretKey: "",
  },
};
