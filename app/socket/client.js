"use strict";

const WebSocket = require("ws");

class SocketClient {
  constructor() {
    this.__handler_open = null;
    this.__handler_close = null;
    this.__handler_message = null;
    this.__handler_error = null;
    this.__handler_ping = null;
    this.__client_instance = null;
    this.__server_address = null;
  }

  set address(address) {
    this.__server_address = address;
  }

  set openHandler(handler) {
    if (this.__checkHandler(handler)) {
      this.__handler_open = handler;
    }
  }

  set messageHandler(handler) {
    if (this.__checkHandler(handler)) {
      this.__handler_message = handler;
    }
  }

  set closeHandler(handler) {
    if (this.__checkHandler(handler)) {
      this.__handler_close = handler;
    }
  }

  set errorHandler(handler) {
    if (this.__checkHandler(handler)) {
      this.__handler_error = handler;
    }
  }

  set pingHandler(handler) {
    if (this.__checkHandler(handler)) {
      this.__handler_ping = handler;
    }
  }

  get url() {
    return this.__server_address;
  }

  get client() {
    if (!this.__client_instance) {
      this.__client_instance = new WebSocket(this.__server_address);
    }
    return this.__client_instance;
  }

  __checkHandler(handler) {
    if (typeof handler === "function") return true;
    throw "handler must be a function";
  }

  __ensureWorker() {
    if (this.__client_instance) {
      this.__client_instance.terminate();
      this.__client_instance = null;
    }
  }

  handleOpen() {
    if (this.__handler_open) {
      this.__handler_open(this.__client_instance);
    }
  }

  handleClose() {
    if (this.__handler_close) {
      this.__handler_close();
    }
  }

  handleError(err) {
    console.error("socket client trigger an error: ", err.message);
    if (this.__handler_error) {
      this.__handler_error(err);
    }
  }

  handlePing() {
    this.__client_instance.pong("ok");
    if (this.__handler_ping) {
      this.__handler_ping(this.__client_instance);
    }
  }

  handleMessage(data) {
    if (this.__handler_message) {
      this.__handler_message(data);
    }
  }

  start() {
    this.__ensureWorker();

    if (!this.__server_address) {
      throw "please set server address.";
    }

    if (!this.__handler_message) {
      throw "please set message handler.";
    }

    this.client.on("open", () => this.handleOpen());
    this.client.on("close", () => this.handleClose());
    this.client.on("error", (err) => this.handleError(err));
    this.client.on("ping", () => this.handlePing());
    this.client.on("message", (data) => this.handleMessage(data));

    return this.client;
  }
}

module.exports = new SocketClient();
