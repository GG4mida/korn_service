"use strict";

module.exports = (app) => {
  const { router, controller } = app;
  router.get("/api/topic/list", controller.topic.list);
  router.get("/api/topic/categories", controller.topic.categories);
  router.get("/api/topic/detail", controller.topic.detail);
  router.get("/api/topic/category/list", controller.topic.categories);
};
