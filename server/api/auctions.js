const { withAuthorization } = require("./sessions");
const { Auction } = require("../models");

const INTERVAL = 10000;
const ITERATIONS = 5;

const STATUS_ACTION = {
  active: "AUCTION:TICK",
  expired: "AUCTION:EXPIRED",
  sold: "AUCTION:SOLD"
};

function broadcast(req, message) {
  req.wss.clients.forEach(client => {
    client.send(message);
  });
}

function listAuctionsHandler(req, res) {
  return res.json({
    auctions: Auction.all(req.query)
  });
}

const createAuctionHandler = withAuthorization((req, res) => {
  const user = req.user;
  const auction = Auction.create({ userId: user.id, ...req.body.auction });

  return res.json({ auction });
});

const udpateAuctionHandler = withAuthorization((req, res) => {
  const { auctionId } = req.params;
  const auction = Auction.findById(auctionId);

  auction.update(req.body.auction);
  return res.json({ auction });
});

const bidAuctionHandler = withAuthorization((req, res) => {
  const user = req.user;
  const { auctionId } = req.params;
  const auction = Auction.findById(auctionId);

  if (!auction) {
    return res.status(404).json({ error: "Auction not found" });
  }

  if (auction.status !== Auction.ACTIVE) {
    return res.status(400).json({ error: "Auction no longer active" });
  }

  if (auction.userId === user.id) {
    return res.status(400).json({ error: "Can not bid for own auction" });
  }

  auction.sell(user);
  broadcast(
    req,
    JSON.stringify({ action: STATUS_ACTION[auction.status], payload: auction })
  );

  return res.json({ auction });
});

function startAuctionHandler(req, res) {
  const { auctionId } = req.params;
  const auction = Auction.findById(auctionId);

  if (!auction) {
    return res.status(404).json({ error: "Auction not found" });
  }

  if (auction.status === Auction.ACTIVE) {
    return res.status(400).json({ auction, error: "Auction already started" });
  }

  auction.start();
  auction.update({ willExpireAt: Date.now() + ITERATIONS * INTERVAL });

  broadcast(
    req,
    JSON.stringify({ action: "AUCTION:STARTED", payload: auction })
  );

  const handle = setInterval(function() {
    const auction = Auction.findById(auctionId);
    if (auction.status !== Auction.ACTIVE) {
      return clearInterval(handle);
    }

    auction.tick(1 / ITERATIONS);

    broadcast(
      req,
      JSON.stringify({
        action: STATUS_ACTION[auction.status],
        payload: auction
      })
    );
  }, INTERVAL);

  return res.json({ auction });
}

module.exports = {
  listAuctionsHandler,
  createAuctionHandler,
  udpateAuctionHandler,
  startAuctionHandler,
  bidAuctionHandler
};
