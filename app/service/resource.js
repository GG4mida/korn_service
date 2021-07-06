"use strict";

const BaseService = require("./base");

class ResourceService extends BaseService {
  constructor(props) {
    super(props);
    this.model = this.ctx.model.Resource;
  }
}

module.exports = ResourceService;
