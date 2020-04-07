/* eslint-env node, mocha */
const assert = require("assert");
const {groupCardsUuidByRarity} = require("./keyCards");

describe("Acceptance tests for groupCardNamesByRarity function", () => {
  it("does add cards according to their rarity", () => {
    const got = groupCardsUuidByRarity([{
      uuid: "test",
      number: 2,
      rarity: "rarity1"
    },{
      uuid: "test2",
      number: 1,
      rarity: "rarity2"
    }]);

    assert.deepEqual(got, {
      rarity1: ["test"],
      rarity2: ["test2"]
    });
  });
});
