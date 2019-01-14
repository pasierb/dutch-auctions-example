import sinon from "sinon";
import {
  createAuctionHandler,
  udpateAuctionHandler,
  bidAuctionHandler
} from "./auctions";
import { User, Auction } from "../models";

describe("auctions", () => {
  let request;
  let response;
  const user = User.create({ username: "bob" });
  let auction;

  beforeEach(() => {
    const auctionUser = User.create({ username: "Jim" });
    auction = Auction.create({
      name: "Sample",
      startPrice: 100,
      userId: auctionUser.id
    });

    request = {
      params: {},
      body: {},
      wss: {
        clients: []
      }
    };

    response = {
      status: () => {},
      json: () => {}
    };
  });

  describe("createAuctionHandler", () => {
    it("should create auction", () => {
      const auction = { name: "TTT", startPrice: 400 };
      const currentCount = Auction.all().length;

      request.user = user;
      request.body = { auction };

      createAuctionHandler(request, response);
      expect(Auction.all().length).toEqual(currentCount + 1);
      const created = Auction.all()[currentCount];

      expect(created.attributes.name).toEqual(auction.name);
      expect(created.startPrice).toEqual(auction.startPrice);
    });
  });

  describe("udpateAuctionHandler", () => {
    it("should return error if not authenticated", () => {
      request.params.auctionId = auction.id;
      const resMock = sinon.mock(response);

      resMock
        .expects("status")
        .once()
        .withArgs(401)
        .returns(response);

      udpateAuctionHandler(request, response);
      resMock.verify();
    });

    it("should return error if not found", () => {
      const resMock = sinon.mock(response);

      resMock
        .expects("status")
        .once()
        .withArgs(404)
        .returns(response);

      udpateAuctionHandler(request, response);
      resMock.verify();
    });
  });

  describe("bidAuctionHandler", () => {
    it("returns 400 if bidding own auction", () => {
      auction.start();

      request.params.auctionId = auction.id;
      request.user = user;

      // const resMock = sinon.mock(response);

      // resMock
      //   .expects("status")
      //   .once()
      //   .withArgs(200)
      //   .returns(response);

      bidAuctionHandler(request, response);
      // resMock.verify();
      expect(auction.status).toEqual("sold");
      expect(auction.buyer.id).toEqual(user.id);
    });

    it("returns 400 if auction inactive", () => {
      auction.update({ status: "expired", userId: user.id });

      request.params.auctionId = auction.id;
      request.user = auction.user;

      const resMock = sinon.mock(response);

      resMock
        .expects("status")
        .once()
        .withArgs(400)
        .returns(response);

      bidAuctionHandler(request, response);
      resMock.verify();
    });

    it("marks auction sold", () => {
      auction.update({ status: "active" });

      request.params.auctionId = auction.id;
      request.user = auction.user;

      const resMock = sinon.mock(response);

      resMock
        .expects("status")
        .once()
        .withArgs(400)
        .returns(response);

      bidAuctionHandler(request, response);
      resMock.verify();
    });
  });
});
