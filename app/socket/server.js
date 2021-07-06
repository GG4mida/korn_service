"use strict";

const fs = require("fs");
const path = require("path");
const https = require("https");
const WebSocket = require("ws");
const { DateTime } = require("../util");

class SocketServer {
  constructor() {
    this.__handler_connection = null;
    this.__handler_listening = null;
    this.__handler_error = null;
    this.__handler_close = null;
    this.__server_host = null;
    this.__server_port = null;
    this.__server_instance = null;
    this.__http_instance = null;
    this.__client_alive_checker = null;
  }

  set host(host) {
    this.__server_host = host;
  }

  set port(port) {
    this.__server_port = port;
  }

  set connectionHandler(handler) {
    if (this.__checkHandler(handler)) {
      this.__handler_connection = handler;
    }
  }

  set listeningHandler(handler) {
    if (this.__checkHandler(handler)) {
      this.__handler_listening = handler;
    }
  }

  set errorHandler(handler) {
    if (this.__checkHandler(handler)) {
      this.__handler_error = handler;
    }
  }

  set closeHandler(handler) {
    if (this.__checkHandler(handler)) {
      this.__handler_close = handler;
    }
  }

  get server() {
    if (this.__server_instance == null) {
      const sslConfigPath = `${path.resolve("./")}/ssl`;

      const httpOptions = {
        cert: fs.readFileSync(`${sslConfigPath}/server-cert.pem`),
        key: fs.readFileSync(`${sslConfigPath}/server-key.pem`),
        passphrase: "fuckpassword",
      };

      this.__http_instance = new https.createServer(httpOptions, (req, res) => {
        res.writeHead(403);
        res.end("this is a websockets server.");
      }).listen(this.__server_port, this.__server_host);

      this.__server_instance = new WebSocket.Server({ server: this.__http_instance });
    }
    return this.__server_instance;
  }

  handleConnection(client) {
    this.__updateClientAliveTime(client);
    this.__handleClientPong(client);

    if (this.__handler_connection) {
      this.__handler_connection(client, this.__server_instance);
    }
  }

  handleError(err) {
    console.error("socker server trigger an error: ", err.message);
    if (this.__handler_error) {
      this.__handler_error(err, this.__server_instance);
    }
  }

  handleClose() {
    clearInterval(this.__client_alive_checker);
    this.__client_alive_checker = null;
    if (this.__handler_close) {
      this.__handler_close();
    }
  }

  handleListening() {
    this.__clientAliveChecker();
    if (this.__handler_listening) {
      this.__handler_listening(this.__server_instance);
    }
  }

  __updateClientAliveTime(client) {
    const currentDateTime = DateTime.getCurrentTime();
    client.latestAliveTime = currentDateTime;
  }

  __isClientAlive(client) {
    const { latestAliveTime } = client;
    const currentDateTime = DateTime.getCurrentTime();
    const aliveThresholdSeconds = 1000 * 60 * 5;
    return (currentDateTime - latestAliveTime) < aliveThresholdSeconds;
  }

  __handleClientPong(client) {
    client.on("pong", () => {
      this.__updateClientAliveTime(client);
    });
  }

  __clientAliveChecker() {
    this.__client_alive_checker = setInterval(() => {
      this.__server_instance.clients.forEach((client) => {
        const isClientAlive = this.__isClientAlive(client);
        if (isClientAlive === false) {
          return client.terminate();
        }
        client.ping("ok?");
      });
    }, 30000);
  }

  __ensureWorker() {
    if (this.__server_instance) {
      this.__server_instance.close();
      this.__server_instance = null;

      this.__http_instance.close();
      this.__http_instance = null;

      clearInterval(this.__client_alive_checker);
    }
  }

  __checkHandler(handler) {
    if (typeof handler === "function") return true;
    throw "handler must be a function";
  }

  start() {
    this.__ensureWorker();

    if (!this.__handler_connection) {
      throw "please set connection handler.";
    }

    if (!this.__handler_listening) {
      throw "please set listening handler.";
    }

    if (!this.__server_host || !this.__server_port) {
      throw "please set server's host & port.";
    }

    this.server.on("close", () => this.handleClose());
    this.server.on("error", (err) => this.handleError(err));
    this.server.on("listening", () => this.handleListening());
    this.server.on("connection", (client) => this.handleConnection(client));

    return this.server;
  }
}

module.exports = new SocketServer();
