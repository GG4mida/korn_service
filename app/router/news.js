"use strict";

module.exports = (app) => {
  const { router, controller } = app;
  router.get("/api/news/get", controller.news.get);
};
