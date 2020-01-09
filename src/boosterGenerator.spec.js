/* eslint-env node, mocha */
const assert = require("assert");
const boosterGenerator = require("./boosterGenerator");

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
    Array(1000).fill().forEach(() => {
      const got = boosterGenerator("EMN");
      got.forEach((card) => {
        if (!card.name) {
          console.log();
        }
      })
      assert.ok(got.length > 10); // TODO make a real test
    })
  });
});
