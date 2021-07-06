"use strict";

const BaseService = require("./base");

class TopicCategoryService extends BaseService {
  constructor(props) {
    super(props);
    this.model = this.ctx.model.TopicCategory;
  }
}

module.exports = TopicCategoryService;
