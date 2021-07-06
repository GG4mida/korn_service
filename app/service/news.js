"use strict";

const BaseService = require("./base");
const qs = require("qs");
const { DateTime, Encryptor } = require("../util");
const { Redis, Cache } = require("../constant");

class NewsService extends BaseService {
  constructor(props) {
    super(props);
    this.model = this.ctx.model.News;
    this.redisInstance = this.ctx.app.redis.get(Redis.REDIS_DB.COMMON);
  }

  async request() {
    const { news: newsConfig } = this.ctx.app.config;
    const { api: newsApi, accessKey, secretKey } = newsConfig;

    try {
      const currentTime = DateTime.getCurrentTimeUnix();

      const requestSignParams = {
        access_key: accessKey,
        date: currentTime,
        secret_key: secretKey,
      };

      const requestSignStr = qs.stringify(requestSignParams);
      const requestSign = Encryptor.md5(requestSignStr).toLowerCase();

      const requestParams = {
        access_key: accessKey,
        date: currentTime,
        sign: requestSign,
      };

      const requestData = qs.stringify(requestParams);

      const requestRes = await this.ctx.curl(`${newsApi}?${requestData}`, {
        method: "GET",
        dataType: "json",
      });

      const { data } = requestRes;
      const { list } = data;
      if (!list || list.length === 0) return false;

      await this._responseHandler(list);
      return true;
    } catch (e) {
      this.ctx.logger.info("get news error.");
      this.ctx.logger.info(e);
    }
  }

  async _responseHandler(list) {
    for (const item of list) {
      const { lives } = item;
      if (!lives || lives.length === 0) continue;
      for (const live of lives) {
        const liveData = await this._responseFormat(live);
        if (!liveData) continue;
        await this.create(liveData);
      }
    }
  }

  async _responseFormat(live) {
    const { id, content, grade, up_counts, down_counts, created_at } = live;

    const res = await this.redisInstance.sadd(Cache.CACHE_KEY.NEWS_DATA, id);
    if (res === 0) return null;

    const liveContentStr = content.replace("【", "");
    const liveTitleSplit = liveContentStr.indexOf("】");

    const liveTitle = liveContentStr.substring(0, liveTitleSplit);
    const liveContent = liveContentStr.substring(liveTitleSplit + 1);
    const liveDateTime = DateTime.formatTime(created_at);

    return {
      source_id: id,
      title: liveTitle,
      content: liveContent,
      createtime: liveDateTime,
      up_counts,
      down_counts,
      grade,
    };
  }

  async getSectionList() {
    const NEWS_LIMIT = 200;

    const newsCondition = {};
    const newsOrder = [["createtime", "desc"]];

    const newsList = await this.getListByPagination(
      1,
      NEWS_LIMIT,
      newsCondition,
      newsOrder
    );

    const result = [];

    if (newsList && newsList.length > 0) {
      const newsGroupList = {};
      for (const news of newsList) {
        const { createtime } = news;
        const createDateTime = DateTime.formatDateTime(
          createtime,
          DateTime.DATE_FORMATTER
        );

        if (!newsGroupList[createDateTime]) {
          newsGroupList[createDateTime] = [];
        }
        newsGroupList[createDateTime].push(news);
      }

      for (const [key, value] of Object.entries(newsGroupList)) {
        const groupItem = {
          title: key,
          data: value,
        };

        result.push(groupItem);
      }
    }

    return result;
  }
}

module.exports = NewsService;
