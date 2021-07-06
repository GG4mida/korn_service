"use strict";

/**
 * 路由环境处理
 */

module.exports = () => {
  return async function router(ctx, next) {
    const { url } = ctx.request;

    if (url.includes("/api/system/init")) {
      if (ctx.app.config.env === "local") {
        await next();
        return;
      }

      ctx.body = "";
      return;
    }

    await next();
    return;
  };
};
