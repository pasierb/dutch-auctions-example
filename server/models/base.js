const uuid = require("uuid/v4");

class Base {
  constructor(attributes) {
    this.attributes = attributes;
  }

  get id() {
    return this.attributes.id;
  }
}

Base.prototype.toJSON = function toJSON() {
  return Object.assign({}, this.attributes);
}

Base.prototype.update = function update(attributes) {
  Object.assign(this.attributes, attributes);
  this.save();
}

function initStore(klass, initialState = []) {
  const store = initialState;

  klass.findById = id => {
    return store.find(item => item.id === id);
  };

  klass.all = (filter = {}) => {
    return store.filter(item => {
      for (const key in filter) {
        if (item.attributes[key] !== filter[key]) {
          return false;
        }
      }

      return true;
    });
  };


  klass.create = attributes => {
    const instance = new klass(attributes);
    instance.save();

    return instance;
  };

  klass.prototype.save = function save() {
    const now = Date.now();

    if (!this.attributes.id) {
      this.attributes.id = uuid();
    }

    if (!this.attributes.createdAt) {
      this.attributes.createdAt = now;
    }

    this.attributes.updatedAt = now;

    const index = store.findIndex(item => item.id === this.id);

    if (index < 0) {
      store.push(this);
    } else {
      store[index] = this;
    }

    return this;
  };

  return klass;
}

module.exports = {
  Base,
  initStore
};
