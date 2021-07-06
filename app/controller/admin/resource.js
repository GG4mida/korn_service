"use strict";
const fs = require("fs");
const path = require("path");
const BaseAdminController = require("./base");
const { String } = require("../../util");

class AdminResourceController extends BaseAdminController {
  async list() {
    const adminInfo = await this.getAdminInfo();
    if (adminInfo == null) {
      await this.responseFailedJson("非法请求");
      return;
    }
    const resourceOrder = [["createtime", "desc"]];
    const resourceList = await this.ctx.service.resource.getListByCondition(
      null,
      resourceOrder
    );

    await this.responseSuccessJson(resourceList);
  }

  async add() {
    const adminInfo = await this.getAdminInfo();
    if (adminInfo == null) {
      await this.responseFailedJson("非法请求");
      return;
    }

    const { name } = this.ctx.request.body;

    const file = this.ctx.request.files[0];

    if (!name || !file || !file.filename) {
      await this.responseFailedJson("请求参数异常");
      return;
    }

    const systemInfo = await this.getSystemInfo();
    const { url: systemUrl } = systemInfo;

    const fileName = String.getRandomString(16) + path.extname(file.filename);
    const filePath = path.join("app/public/resource", fileName);

    const fileResource = fs.readFileSync(file.filepath);
    fs.writeFileSync(filePath, fileResource);
    const fileUrl = `${systemUrl}${path.join("/public/resource", fileName)}`;
    const resourceAddData = {
      name,
      path: filePath,
      url: fileUrl,
    };
    const resourceCreateRes = await this.ctx.service.resource.create(
      resourceAddData
    );
    if (!resourceCreateRes) {
      await this.responseFailedJson("资源添加失败，请稍候重试");
      return;
    }
    await this.responseSuccessJson("资源添加成功");
  }

  async del() {
    const adminInfo = await this.getAdminInfo();
    if (!adminInfo) {
      await this.responseFailedJson("非法请求");
      return;
    }

    const { id } = this.ctx.request.body;
    if (!id) {
      await this.responseFailedJson("请求参数异常");
      return;
    }

    const resourceDelCondition = {
      id,
    };

    const resourceDelRes = await this.ctx.service.resource.delete(
      resourceDelCondition
    );

    if (!resourceDelRes) {
      await this.responseFailedJson("操作失败，请稍候重试");
      return;
    }

    await this.responseSuccessJson("操作成功");
  }
}

module.exports = AdminResourceController;
