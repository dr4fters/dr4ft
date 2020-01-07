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
});
