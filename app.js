"use strict";

class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  async willReady() {
    if (this.app.config.env === "local") {
      await this.app.model.sync({
        force: false,
      });
    }
  }
}

module.exports = AppBootHook;
