const { Auction, User } = require("./server/models");

const marco = User.create({ username: "Marco" });
const rahul = User.create({ username: "Rahul" });

Auction.create({ startPrice: 1000, userId: marco.id, name: "Atari XL/XE" });
Auction.create({ startPrice: 500, userId: rahul.id, name: "CLRS" });
