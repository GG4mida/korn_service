"use strict";

module.exports = (app) => {
  const { router, controller } = app;
  require("./router/user")(app);
  require("./router/topic")(app);
  require("./router/system")(app);
  require("./router/news")(app);
  require("./router/market")(app);
  require("./router/kline")(app);
  require("./router/exchange")(app);
  require("./router/account")(app);
  require("./router/coin")(app);
  require("./router/admin")(app);

  router.get("/home", controller.home.index);
};
