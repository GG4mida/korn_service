"use strict";
const fs = require("fs");
const path = require("path");
const BaseService = require("./base");
const { Redis, Cache } = require("../constant");

class SystemConfigService extends BaseService {
  constructor(props) {
    super(props);
    this.model = this.ctx.model.SystemConfig;
    this.redisInstance = this.ctx.app.redis.get(Redis.REDIS_DB.COMMON);
  }

  /**
   * 获取配置详情
   * @param {string} useCache - 是否取缓存
   */
  async getConfig(useCache = true) {
    if (useCache === false) {
      return await this.getOneByCondition();
    }

    let systemConfigData = await this.redisInstance.get(
      Cache.CACHE_KEY.SYSTEM_CONFIG
    );
    if (systemConfigData) {
      return JSON.parse(systemConfigData);
    }
    systemConfigData = await this.getOneByCondition();
    if (systemConfigData) {
      await this.redisInstance.set(
        Cache.CACHE_KEY.SYSTEM_CONFIG,
        JSON.stringify(systemConfigData)
      );
    }
    return systemConfigData;
  }

  /**
   * 获取头像列表
   */
  async getAvatars() {
    let avatarList = await this.redisInstance.get(Cache.CACHE_KEY.AVATAR_LIST);
    if (avatarList) {
      return JSON.parse(avatarList);
    }
    avatarList = [];
    try {
      const filePath = path.resolve("app/public/avatar");
      const files = fs.readdirSync(filePath);

      if (files && files.length) {
        const systemConfig = await this.getConfig();
        const { url: systemUrl } = systemConfig;
        const exts = [".jpg", ".png"];
        for (const file of files) {
          const fileExt = path.extname(file);
          if (exts.includes(fileExt)) {
            const avatarItem = {
              url: `${systemUrl}/public/avatar/${file}`,
              name: file,
            };

            avatarList.push(avatarItem);
          }
        }
      }

      if (avatarList.length) {
        await this.redisInstance.set(
          Cache.CACHE_KEY.AVATAR_LIST,
          JSON.stringify(avatarList)
        );
      }
    } catch (e) {
      this.ctx.logger.error("system get avatars error:" + e.message);
    }

    return avatarList;
  }

  /**
   * 清空缓存配置
   */
  async clearCache() {
    this.redisInstance.del(Cache.CACHE_KEY.SYSTEM_CONFIG);
  }
}

module.exports = SystemConfigService;
