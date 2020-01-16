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

  describe("can parse special cards", () => {
    it("parse a devoid card as color is colorless", () => {});
    it("parse a DFC card as doubleFaced and with a flippedCardURL", () => {});
    it("parse a transform card as doubleFaced and with a flippedCardURL", () => {});
    it("parse a split|aftermath|adventure card with double name", () => {});
    it("parse a split card with correct mana cost", () => {});
    it("parse a multicolor card as multicolor", () => {});
    it("parse a no color card as colorless", () => {});
  });
});
