"use strict";

const WebSocket = require("ws");
const { Service } = require("egg");
const SocketServer = require("../socket/server");
const { Market, Redis } = require("../constant");

class SocketServerService extends Service {
  constructor(props) {
    super(props);
    this.redisInstance = this.ctx.app.redis.get(Redis.REDIS_DB.SUBSCRIPTION);
  }

  async handleListening(wss) {
    this.redisInstance.subscribe(Market.MARKET_PUBLISH_CHANNEL);
    this.redisInstance.on("message", (channel, message) => {
      if (channel !== Market.MARKET_PUBLISH_CHANNEL) return;
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    });
  }

  async handleConnection() {
    console.info("handle connection");
  }

  async start() {
    SocketServer.host = "127.0.0.1";
    SocketServer.port = 8848;
    SocketServer.listeningHandler = (wss) => this.handleListening(wss);
    SocketServer.connectionHandler = (ws, wss) =>
      this.handleConnection(ws, wss);
    SocketServer.start();
  }
}

module.exports = SocketServerService;
