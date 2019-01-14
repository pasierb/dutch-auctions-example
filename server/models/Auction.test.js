import sinon from "sinon";
import Auction from "./Auction";

describe("Auction", () => {
  describe("tick()", () => {
    it("reduces currentPrice", () => {
      const auction = new Auction({ currentPrice: 100, startPrice: 100 });

      auction.tick(0.2);

      expect(auction.currentPrice).toEqual(80);
    });

    it("calls finish if price drops to 0", () => {
      const auction = new Auction({ currentPrice: 0, startPrice: 100 });
      const mock = sinon.mock(auction);

      mock.expects("finish").once();
      auction.tick(0.1);
      mock.verify();
    });
  });
});
