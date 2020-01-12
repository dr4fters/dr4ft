/* eslint-env node, mocha */
const assert = require("assert");
const data = require("./data");

describe("Acceptance tests for Data functions", () => {
  describe("can find certain starter sets", () => {
    it("find starter key in playable sets", () => {
      const playableSets = data.getPlayableSets();
      assert(playableSets["starter"]);
    });
  });
});
