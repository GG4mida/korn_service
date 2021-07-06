"use strict";

const BaseService = require("./base");

class UserFavoriteService extends BaseService {
  constructor(props) {
    super(props);
    this.model = this.ctx.model.UserFavorite;
  }
}

module.exports = UserFavoriteService;
