"use strict";

/**
 * 系统 log 日志
 */

module.exports = () => {
  return async function log(ctx, next) {
    const { url, header } = ctx;

    const userAgent = header["user-agent"];

    const systemLogData = {
      url,
      user_agent: userAgent,
    };

    try {
      ctx.service.systemLog.create(systemLogData);
    } catch (e) {
      ctx.logger.error(e.message);
    }

    await next();
    return;
  };
};
