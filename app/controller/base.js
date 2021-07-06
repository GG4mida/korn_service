"use strict";

const { Controller } = require("egg");
const { ResponseCode } = require("../constant");

class BaseController extends Controller {
  /**
   * 输出 json 内容
   * @param {object} data - 数据
   * @param {number} code - 状态码
   */
  async responseJson(data, code) {
    this.ctx.body = {
      code,
      content: data,
    };
  }

  /**
   * 输出 code = 200 的 json 内容
   * @param {object} data - 数据
   */
  async responseSuccessJson(data) {
    this.responseJson(data, ResponseCode.SUCCESS);
  }

  /**
   * 输出 code = 400 的 json 内容
   * @param {object} data - 数据
   */
  async responseFailedJson(data) {
    this.responseJson(data, ResponseCode.FAILED);
  }

  /**
   * 结束页面响应
   * @param {string} msg - 结束页面的信息
   */
  async die(msg = "") {
    this.ctx.body = msg;
    return;
  }

  /**
   * 获取站点配置信息
   * @param {string} useCache - 是否取缓存
   */
  async getSystemInfo(useCache = true) {
    return await this.ctx.service.systemConfig.getConfig(useCache);
  }

  /**
   * 获取用户请求 token
   */
  getToken() {
    return this.ctx.request.header.authorization;
  }
}

module.exports = BaseController;
