require('dotenv').config();
require('./seed');
const express = require("express");
const WebSocketServer = require("ws").Server;
const next = require("next");

const nextConfig = require("./next.config");
const {
  createAuctionHandler,
  listAuctionsHandler,
  udpateAuctionHandler,
  startAuctionHandler,
  bidAuctionHandler
} = require("./server/api/auctions");
const { signInHandler, verifyHandler } = require("./server/api/sessions");

const dev = process.env.NODE_ENV !== "production";
const port = 3000;

const app = next({
  dev,
  conf: nextConfig
});
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();
    const wss = new WebSocketServer({ port: 40511 });

    server.use(express.json());
    server.use((req, res, next) => {
      req.wss = wss;
      next();
    });

    server.get("/api/auctions", listAuctionsHandler);
    server.post("/api/auctions", createAuctionHandler);
    server.patch("/api/auctions/:auctionId", udpateAuctionHandler);
    server.post("/api/auctions/:auctionId/start", startAuctionHandler);
    server.post("/api/auctions/:auctionId/bid", bidAuctionHandler);
    server.post("/api/sessions", signInHandler);
    server.post("/api/sessions/verify", verifyHandler);

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(port, err => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
