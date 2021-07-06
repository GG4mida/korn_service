"use strict";

module.exports = (app) => {
  const { router, controller } = app;
  router.get("/api/market/get", controller.market.get);
};
