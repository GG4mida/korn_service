"use strict";

const { ResponseCode } = require("../constant");
const { DateTime } = require("../util");
const { Op } = require("sequelize");

const getUrlPath = (url) => {
  const urlParamsIndex = url.indexOf("?");
  return urlParamsIndex === -1 ? url : url.slice(0, urlParamsIndex);
};

module.exports = () => {
  return async function authorization(ctx, next) {
    const { url } = ctx.request;

    if (url.includes("/api/admin/")) {
      await next();
      return;
    }

    const urlPath = getUrlPath(url);

    const whiteListUrls = [
      "/home",
      "/api/account/login",
      "/api/account/signup",
      "/api/system/init",
      "/api/system/info",
      "/api/system/start",
    ];

    if (whiteListUrls.includes(urlPath)) {
      await next();
      return;
    }

    const {
      header: { authorization: token },
    } = ctx.request;

    const noauthData = {
      code: ResponseCode.NOAUTH,
      content: "身份验证失败",
    };

    if (!token) {
      ctx.body = noauthData;
      return;
    }

    const currentDateTime = DateTime.getCurrentDateTime();
    const userTokenCondition = {
      token,
      expiretime: {
        [Op.gt]: currentDateTime,
      },
    };

    const userTokenData = await ctx.service.userToken.getOneByCondition(
      userTokenCondition
    );
    if (!userTokenData) {
      ctx.body = noauthData;
      return;
    }

    await next();
    return;
  };
};
