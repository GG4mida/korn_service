"use strict";

module.exports = (app) => {
  const { router, controller } = app;
  router.get("/api/user/info", controller.user.info);
  router.get("/api/user/holds", controller.user.holds);
  router.get("/api/user/operates", controller.user.operates);
  router.post("/api/user/update", controller.user.update);
  router.post("/api/user/reset", controller.user.reset);
};
