const {describe, it} = require("mocha");
const assert = require("assert");
const boosterGenerator = require("./boosterGenerator");
const {range} = require("lodash");

describe("Acceptance tests for boosterGenerator function", () => {
  it("should create a MH1 booster", () => {
    const got = boosterGenerator("MH1");
    assert.ok(got.length > 10); // TODO make a real test
  });
  it("should create a RNA booster", () => {
    const got = boosterGenerator("RNA");
    assert.ok(got.length > 10); // TODO make a real test
  });
  it("should create tons of EMN booster", () => {
    range(1000).forEach(() => {
      const got = boosterGenerator("EMN");
      got.forEach((card) => {
        if (!card.name) {
          assert.fail("card should have a name");
        }
      });
      assert.ok(got.length > 10); // TODO make a real test
    });
  });
});
