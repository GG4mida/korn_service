"use strict";

module.exports = (app) => {
  const { router, controller } = app;
  router.get("/api/coin/list", controller.coin.list);
  router.post("/api/coin/buyin", controller.coin.buyin);
  router.post("/api/coin/sell", controller.coin.sell);

  router.get("/api/coin/favorite/list", controller.coin.favorites);
  router.post("/api/coin/favorite/add", controller.coin.favorite_add);
  router.post("/api/coin/favorite/del", controller.coin.favorite_del);
};
