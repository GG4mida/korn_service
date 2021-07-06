"use strict";

module.exports = (app) => {
  const { router, controller } = app;
  router.get("/api/exchange/get", controller.exchange.get);
};
