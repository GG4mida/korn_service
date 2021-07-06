"use strict";

module.exports = (app) => {
  const { router, controller } = app;
  router.get("/api/kline/get", controller.kline.get);
};
