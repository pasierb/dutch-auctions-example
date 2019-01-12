const { Base, initStore } = require("./base");

describe("Base", () => {
  describe('constructor', () => {
    it('should assign attributes', () => {
      class Dummy extends Base {}
      const attributes = { a: 1, b: 2};
      const dummy = new Dummy(attributes);

      expect(dummy.attributes).toEqual(attributes);
    })
  })
});

describe("initStore()", () => {
  let Dummy;

  beforeEach(() => {
    Dummy = initStore(() => {});
  });

  it("should augment klass with all method", () => {
    expect(typeof Dummy.all).toBe("function");
  });

  it("should augment klass with create method", () => {
    expect(typeof Dummy.create).toBe("function");
  });

  it("should augment klass with findById method", () => {
    expect(typeof Dummy.findById).toBe("function");
  });

  it("should augment instances with save method", () => {
    const instance = new Dummy();
    expect(typeof instance.save).toBe("function");
  });

  describe("all()", () => {
    it("should return empty array", () => {
      expect(Dummy.all()).toBeInstanceOf(Array);
      expect(Dummy.all().length).toEqual(0);
    });
  });
});
