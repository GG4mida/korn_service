"use strict";

module.exports = (app) => {
  const { router, controller } = app;
  router.get("/api/system/init", controller.system.init);
  router.get("/api/system/info", controller.system.info);
  router.get("/api/system/start", controller.system.start);
  router.get("/api/system/avatars", controller.system.avatars);
};
