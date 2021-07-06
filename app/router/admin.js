"use strict";

module.exports = (app) => {
  const { router, controller } = app;
  router.post("/api/admin/login", controller.admin.account.login);
  router.get("/api/admin/logout", controller.admin.account.logout);
  router.get("/api/admin/profile", controller.admin.account.profile);

  router.get("/api/admin/user/list", controller.admin.user.list);

  router.get("/api/admin/topic/list", controller.admin.topic.list);
  router.get("/api/admin/topic/detail", controller.admin.topic.detail);
  router.post("/api/admin/topic/add", controller.admin.topic.add);
  router.post("/api/admin/topic/edit", controller.admin.topic.edit);
  router.post("/api/admin/topic/delete", controller.admin.topic.delete);

  router.get(
    "/api/admin/topic/category/list",
    controller.admin.topicCategory.list
  );
  router.get(
    "/api/admin/topic/category/detail",
    controller.admin.topicCategory.detail
  );
  router.post(
    "/api/admin/topic/category/add",
    controller.admin.topicCategory.add
  );
  router.post(
    "/api/admin/topic/category/edit",
    controller.admin.topicCategory.edit
  );
  router.post(
    "/api/admin/topic/category/delete",
    controller.admin.topicCategory.delete
  );

  router.get("/api/admin/system/info", controller.admin.system.info);
  router.post("/api/admin/system/update", controller.admin.system.update);

  router.get("/api/admin/resource/list", controller.admin.resource.list);
  router.post("/api/admin/resource/add", controller.admin.resource.add);
  router.post("/api/admin/resource/del", controller.admin.resource.del);
};
