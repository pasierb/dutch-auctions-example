const { Base, initStore } = require("./base");

class User extends Base {
  get username() {
    return this.attributes.username;
  }
}

module.exports = initStore(User);
