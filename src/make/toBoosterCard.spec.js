/* eslint-env node, mocha */
const assert = require("assert");
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
    });
    it("parse cards with double faced card", () => {
      if (fs.existsSync("data/sets")) {
        const files = fs.readdirSync("data/sets");
        files.forEach(file => {
          if (!/.json/g.test(file)) {
            return;
          }
          const path = `data/sets/${file}`;
          const json = JSON.parse(fs.readFileSync(path, "UTF-8"));
          json.cards.forEach((card) => {
            const isDoubleFaced = /^double-faced$|^transform$|^flip$|^meld$/i.test(card.layout);

            if (isDoubleFaced && (!card.otherFaceIds || !(card.otherFaceIds.length == 1))) {
              assert.fail("shouldn't be like that");
            }

          });
        });
      }
    });
  });
});
