"use strict";

module.exports = (app) => {
  const { router, controller } = app;
  router.post("/api/account/login", controller.account.login);
  router.post("/api/account/signup", controller.account.signup);
  router.post("/api/account/logout", controller.account.logout);
};
