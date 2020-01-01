/* eslint-env node, mocha */
const assert = require("assert");
const groupCardNamesByRarity = require("./groupCardNamesByRarity");

describe("Acceptance tests for groupCardNamesByRarity function", () => {
  it("does not add card that are with a baseSetSize bigger", () => {

    const got = groupCardNamesByRarity(1, [{
      name: "test",
      number: 2,
      rarity: "test"
    }]);

    assert.deepEqual(got, {});
  });
  it("does add card that have with a number equal or less than baseSetSize", () => {
    const got = groupCardNamesByRarity(2, [{
      name: "test",
      number: 2,
      rarity: "test"
    },{
      name: "test2",
      number: 1,
      rarity: "test"
    }]);

    assert.deepEqual(got, {
      test: ["test", "test2"]
    });
  });
  it("does add cards according to their rarity", () => {
    const got = groupCardNamesByRarity(2, [{
      name: "test",
      number: 2,
      rarity: "rarity1"
    },{
      name: "test2",
      number: 1,
      rarity: "rarity2"
    }]);

    assert.deepEqual(got, {
      rarity1: ["test"],
      rarity2: ["test2"]
    });
  });
});
