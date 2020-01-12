/* eslint-env node, mocha */
const toBoosterCard = require("./toBoosterCard");
const fs = require("fs");

describe("Acceptance tests for toBoosterCard function", () => {
  describe("can parse all the sets", () => {
    it("parse cards without errors from all the sets downloaded", () => {
      if (fs.existsSync("data/sets")) {
        const files = fs.readdirSync("data/sets");
        files.forEach(file => {
          if (!/.json/g.test(file)) {
            return;
          }
          const path = `data/sets/${file}`;
          const json = JSON.parse(fs.readFileSync(path, "UTF-8"));
          json.cards.reduce(toBoosterCard, {});
        });
      }
    }).timeout(10000);
  });
});
