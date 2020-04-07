const {describe, it} = require("mocha");
const assert = require("assert");
const boosterGenerator = require("./boosterGenerator");
const {range} = require("lodash");

describe("Acceptance tests for boosterGenerator function", () => {
  it("should create a MH1 booster", () => {
    const got = boosterGenerator("MH1");
    assert(got.length > 10);
    got.forEach(card => assert(card.name != undefined));
  });
  it("should create a RNA booster", () => {
    const got = boosterGenerator("RNA");
    got.forEach(card => assert(card.name != undefined));
  });
  it("should create tons of EMN booster", () => {
    range(1000).forEach(() => {
      const got = boosterGenerator("EMN");
      assert(got.length > 10);
      got.forEach(card => assert(card.name != undefined));
    });
  });
});
