import sinon from "sinon";
import { createAuctionHandler, udpateAuctionHandler } from "./auctions";
import { User, Auction } from "../models";

describe("auctions", () => {
  let request;
  let response;
  const user = User.create({ username: "bob" });
  let auction;

  beforeEach(() => {
    auction = Auction.create({ name: "Sample", startPrice: 100 });

    request = {
      params: {},
      body: {}
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
});
