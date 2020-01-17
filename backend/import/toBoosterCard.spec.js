/* eslint-env node, mocha */
const fs = require("fs");
const assert = require("assert");
const toBoosterCard = require("./toBoosterCard");

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
          const [setCode] = file.split(".");
          const json = JSON.parse(fs.readFileSync(path, "UTF-8"));
          json.cards
            .map(toBoosterCard(setCode))
            .forEach((card) => assert(card.name != undefined, "card must have a name"));
        });
      }
    }).timeout(10000);
  });

  describe("can parse special cards", () => {
    it("parse a devoid card as color is colorless", () => {
      const devoidCard = {
        "colorIdentity": ["U"],
        "colors": [],
        "convertedManaCost": 4.0,
        "frameEffect": "devoid",
        "frameEffects": ["devoid"],
        "frameVersion": "2015",
        "hasFoil": true,
        "hasNonFoil": true,
        "isMtgo": true,
        "isPaper": true,
        "layout": "normal",
        "manaCost": "{3}{U}",
        "mcmId": 284821,
        "mcmMetaId": 220757,
        "mtgoFoilId": 58356,
        "mtgoId": 58355,
        "multiverseId": 401803,
        "name": "Adverse Conditions",
        "names": [],
        "number": "54",
        "printings": ["BFZ"],
        "rarity": "uncommon",
        "scryfallId": "03d86e0b-294f-41b8-a5cd-d3144a019334",
        "scryfallIllustrationId": "6aa5f6c0-31f2-4cc2-aab6-34546581526d",
        "scryfallOracleId": "7a5a81f7-1597-4972-8565-fd2a5667df99",
        "subtypes": [],
        "supertypes": [],
        "tcgplayerProductId": 105564,
        "text": "Devoid (This card has no color.)\nTap up to two target creatures. Those creatures don't untap during their controller's next untap step. Create a 1/1 colorless Eldrazi Scion creature token. It has \"Sacrifice this creature: Add {C}.\"",
        "type": "Instant",
        "types": ["Instant"],
        "uuid": "3ac54c2b-cd67-5fcd-b9f5-0e6cfb54e17c"
      };
      const [parsedCard] = [devoidCard].map(toBoosterCard("setCode"));
      assert(parsedCard.color === "Colorless", "devoid cards must have color equal to colorless");
    });
    it("parse a DFC card as doubleFaced and with a flippedCardURL", () => {});
    it("parse a transform card as doubleFaced and with a flippedCardURL", () => {});
    it("parse a split|aftermath|adventure card with double name", () => {});
    it("parse a split card with correct mana cost", () => {
      const down = {
        "colorIdentity": ["B", "G"],
        "colors": ["B"],
        "convertedManaCost": 7.0,
        "faceConvertedManaCost": 4.0,
        "foreignData": [],
        "frameVersion": "2003",
        "layout": "split",
        "manaCost": "{3}{B}",
        "multiverseId": 369089,
        "name": "Down",
        "names": ["Down", "Dirty"],
        "number": "126",
        "otherFaceIds": ["f1701b93-065a-54ca-9a96-a924b7312801"],
        "printings": ["DGM"],
        "rarity": "uncommon",
        "scryfallId": "c35c63c1-6344-4d8c-8f7d-cd253d12f9ae",
        "scryfallIllustrationId": "896e9aff-0430-4912-9a87-2f6377252145",
        "scryfallOracleId": "eba21e3b-e2b2-4e0b-82e3-f0849943fd89",
        "side": "a",
        "subtypes": [],
        "supertypes": [],
        "text": "Target player discards two cards.\nFuse (You may cast one or both halves of this card from your hand.)",
        "type": "Sorcery",
        "types": ["Sorcery"],
        "uuid": "c6875787-16eb-5199-bd1e-586dd759171e",
      };
      const dirty = {
        "colorIdentity": ["B", "G"],
        "colors": ["G"],
        "convertedManaCost": 7.0,
        "faceConvertedManaCost": 3.0,
        "foreignData": [],
        "layout": "split",
        "manaCost": "{2}{G}",
        "mcmId": 261576,
        "mcmMetaId": 207993,
        "mtgoId": 48508,
        "multiverseId": 369089,
        "name": "Dirty",
        "names": ["Down", "Dirty"],
        "number": "126",
        "otherFaceIds": ["c6875787-16eb-5199-bd1e-586dd759171e"],
        "printings": ["DGM"],
        "rarity": "uncommon",
        "scryfallId": "c35c63c1-6344-4d8c-8f7d-cd253d12f9ae",
        "side": "b",
        "subtypes": [],
        "supertypes": [],
        "tcgplayerProductId": 67989,
        "text": "Return target card from your graveyard to your hand.\nFuse (You may cast one or both halves of this card from your hand.)",
        "type": "Sorcery",
        "types": ["Sorcery"],
        "uuid": "f1701b93-065a-54ca-9a96-a924b7312801",
      };

      const [downParsed, dirtyParsed] = [down, dirty].map(toBoosterCard("setCode"));
      assert(downParsed.cmc == 7, "split card CMC must equal to both side CMC");
      assert(dirtyParsed.cmc == 7, "split card CMC must equal to both side CMC");
    });
    it("parse a multicolor card as multicolor", () => {});
    it("parse a no color card as colorless", () => {});
  });
});
