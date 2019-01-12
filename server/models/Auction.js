const User = require("./User");
const { Base, initStore } = require("./base");

class Auction extends Base {
  constructor(attributes) {
    super({ status: Auction.PENDING, ...attributes });
  }

  get status() {
    return this.attributes.status;
  }

  get startPrice() {
    return Number(this.attributes.startPrice);
  }

  get currentPrice() {
    return Number(this.attributes.currentPrice || 0);
  }

  get buyer() {
    const { buyerUserId} = this.attributes;

    return buyerUserId && User.findById(buyerUserId);
  }

  get user() {
    return User.findById(this.attributes.userId);
  }

  start() {
    this.update({
      currentPrice: this.startPrice,
      finishedAt: undefined,
      startedAt: Date.now(),
      status: Auction.ACTIVE
    });
  }

  finish() {
    this.update({
      finishedAt: Date.now(),
      status: Auction.EXPIRED,
      currentPrice: 1
    });
  }

  tick(fraction) {
    const priceDrop = this.startPrice * fraction;
    const newPrice = Math.ceil(this.currentPrice - priceDrop);

    if (newPrice <= 0) {
      this.finish();
    } else {
      this.update({ currentPrice: newPrice });
    }
  }

  sell(user) {
    this.update({
      status: Auction.SOLD,
      finishedAt: Date.now(),
      buyerUserId: user.id
    });
  }

  toJSON() {
    const { currentPrice, startPrice, buyer, user } = this;

    return Object.assign(super.toJSON(), { currentPrice, startPrice, buyer, user });
  }
}

Auction.PENDING = "pending";
Auction.ACTIVE = "active";
Auction.EXPIRED = "expired";
Auction.SOLD = "sold";

module.exports = initStore(Auction);
