"use strict";

const { Controller } = require("egg");
class HomeController extends Controller {
  async index() {
    this.ctx.body = "hi, korn";
  }
}

module.exports = HomeController;
