/* eslint-env node, mocha */
const fs = require("fs");
const assert = require("assert");
const toBoosterCard = require("./toBoosterCard");
const path = require("path");
const {getDataDir} = require("../data");

describe("Acceptance tests for toBoosterCard function", () => {
  describe("can parse all the sets", () => {
    it("parse cards without errors from all the sets downloaded", () => {
      const setsDataDir = path.join(getDataDir(), "sets");
      if (fs.existsSync(setsDataDir)) {
        const files = fs.readdirSync(setsDataDir);
        files.forEach(file => {
          if (!/.json/g.test(file)) {
            return;
          }
          const filePath = path.join(setsDataDir, `${file}`);
          const [setCode] = file.split(".");
          const json = JSON.parse(fs.readFileSync(filePath, "UTF-8"));
          json.data.cards
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
        "otherFaceIds": [],
        "number": "54",
        "printings": ["BFZ"],
        "rarity": "uncommon",
        "identifiers": {"scryfallId": "03d86e0b-294f-41b8-a5cd-d3144a019334"},
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

    it("parse a DFC card as doubleFaced and with a flippedCardURL", () => {
      const gisela = {
        "colorIdentity": ["W"],
        "colors": ["W"],
        "convertedManaCost": 4.0,
        "layout": "meld",
        "manaCost": "{2}{W}{W}",
        "mcmId": 290930,
        "mcmMetaId": 222995,
        "mtgoId": 61100,
        "multiverseId": 414319,
        "name": "Gisela, the Broken Blade",
        "number": "28a",
        "otherFaceIds": ["7fb7e1e7-17d0-50ba-80a0-9a225321d64d", "e81b3362-515c-5d2f-b842-7fa301518d84"],
        "power": "4",
        "rarity": "mythic",
        "identifiers": {"scryfallId": "c75c035a-7da9-4b36-982d-fca8220b1797"},
        "scryfallIllustrationId": "db5289ab-8aa4-412d-afd4-f7b7fef475fb",
        "scryfallOracleId": "f3e23d5e-bd88-4e7c-a3fb-db2a8cb05b22",
        "side": "b",
        "subtypes": ["Angel", "Horror"],
        "supertypes": ["Legendary"],
        "tcgplayerProductId": 119687,
        "text": "Flying, first strike, lifelink\nAt the beginning of your end step, if you both own and control Gisela, the Broken Blade and a creature named Bruna, the Fading Light, exile them, then meld them into Brisela, Voice of Nightmares.",
        "toughness": "3",
        "type": "Legendary Creature — Angel Horror",
        "types": ["Creature"],
        "uuid": "4b560297-2f1e-5f65-b118-289c21bdf887"
      };
      const brisela = {
        "artist": "Clint Cearley",
        "borderColor": "black",
        "colorIdentity": ["W"],
        "colors": [],
        "convertedManaCost": 11.0,
        "frameVersion": "2015",
        "hasFoil": true,
        "hasNonFoil": true,
        "isMtgo": true,
        "isPaper": true,
        "layout": "meld",
        "mcmId": 290929,
        "mcmMetaId": 222994,
        "multiverseId": 414305,
        "name": "Brisela, Voice of Nightmares",
        "number": "15b",
        "originalText": "When you cast Bruna, the Fading Light, you may return target Angel or Human creature card from your graveyard to the battlefield.\nFlying, vigilance\n(Melds with Gisela, the Broken Blade.)",
        "originalType": "Legendary Creature — Angel Horror",
        "otherFaceIds": ["e81b3362-515c-5d2f-b842-7fa301518d84", "4b560297-2f1e-5f65-b118-289c21bdf887"],
        "power": "9",
        "rarity": "mythic",
        "identifiers": {"scryfallId": "5a7a212e-e0b6-4f12-a95c-173cae023f93"},
        "side": "c",
        "subtypes": ["Eldrazi", "Angel"],
        "supertypes": ["Legendary"],
        "tcgplayerProductId": 119686,
        "text": "Flying, first strike, vigilance, lifelink\nYour opponents can't cast spells with converted mana cost 3 or less.",
        "toughness": "10",
        "type": "Legendary Creature — Eldrazi Angel",
        "types": ["Creature"],
        "uuid": "7fb7e1e7-17d0-50ba-80a0-9a225321d64d"
      };

      const [parsedCard] = [gisela, brisela].map(toBoosterCard("setCode"));
      assert(parsedCard.isDoubleFaced, "gisela should be double faced");
      assert(parsedCard.flippedCardURL != "", "gisela should have a flipped card");
      assert(parsedCard.flippedCardNumber != "", "gisela should have a flipped card");
      assert(parsedCard.flippedScryfallId != "", "gisela should have a flipped card");
    });

    it("parse a flip card as doubleFaced and with a flippedCardURL", () => {
      const akki = {
        "colorIdentity": ["R"],
        "colors": ["R"],
        "convertedManaCost": 4.0,
        "layout": "flip",
        "mtgoFoilId": 21238,
        "mtgoId": 21237,
        "multiverseId": 78694,
        "name": "Tok-Tok, Volcano Born",
        "number": "153",
        "originalText": "Protection from red\nIf a red source would deal damage to a player, it deals that much damage plus 1 to that player instead.",
        "originalType": "Legendary Creature Goblin Shaman",
        "otherFaceIds": ["4d4a2729-ac3d-57ba-b73a-8f85a90810df"],
        "power": "2",
        "rarity": "rare",
        "rulings": [],
        "identifiers": {"scryfallId": "6ee6cd34-c117-4d7e-97d1-8f8464bfaac8"},
        "scryfallIllustrationId": "54705304-6aeb-4722-9a17-9006db12b939",
        "scryfallOracleId": "47795817-73e5-4af6-bd1e-d69b193e8e9e",
        "side": "b",
        "subtypes": ["Goblin", "Shaman"],
        "supertypes": ["Legendary"],
        "tcgplayerProductId": 11938,
        "text": "Protection from red\nIf a red source would deal damage to a player, it deals that much damage plus 1 to that player instead.",
        "toughness": "2",
        "type": "Legendary Creature — Goblin Shaman",
        "types": ["Creature"],
        "uuid": "631c1845-cc99-5014-a96b-fda6356302ae"
      };

      const [parsedCard] = [akki].map(toBoosterCard("setCode"));
      assert(parsedCard.isDoubleFaced, "Flip card should be doubleFaced");
    });
    it("parse a transform card as doubleFaced and with a flippedCardURL", () => {
      const transformCard = {
        "colorIdentity": ["R", "W"],
        "colorIndicator": ["R"],
        "colors": ["R"],
        "convertedManaCost": 5.0,
        "edhrecRank": 2260,
        "faceConvertedManaCost": 0,
        "frameEffect": "sunmoondfc",
        "frameEffects": ["sunmoondfc"],
        "layout": "transform",
        "multiverseId": 409742,
        "name": "Avacyn, the Purifier",
        "number": "5",
        "originalText": "Flying\nWhen this creature transforms into Avacyn, the Purifier, it deals 3 damage to each other creature and each opponent.",
        "originalType": "Legendary Creature — Angel",
        "otherFaceIds": ["48d97849-95e7-5c18-ac24-2e6a7ad10fc3"],
        "identifiers": {"scryfallId": "7dfc573c-79b9-4fd9-b721-725323a320a8"},
        "power": "6",
        "rarity": "mythic",
        "side": "b",
        "subtypes": ["Angel"],
        "supertypes": ["Legendary"],
        "text": "Flying\nWhen this creature transforms into Avacyn, the Purifier, it deals 3 damage to each other creature and each opponent.",
        "toughness": "5",
        "type": "Legendary Creature — Angel",
        "types": ["Creature"],
        "uuid": "dac5ebae-13c3-5242-a3fe-5080dc9fe391"
      };
      const [parsedCard] = [transformCard].map(toBoosterCard("setCode"));
      assert(parsedCard.isDoubleFaced, "Transform card should be doubleFaced");
    });

    it("parse a split|aftermath card with double name", () => {
      const adventureCard = {
        "colorIdentity": ["U"],
        "colors": ["U"],
        "convertedManaCost": 3.0,
        "edhrecRank": 9073,
        "faceConvertedManaCost": 3.0,
        "flavorText": "A true puppet master has no need for strings.",
        "foreignData": [],
        "frameEffect": "showcase",
        "frameEffects": ["showcase"],
        "frameVersion": "2015",
        "hasFoil": true,
        "hasNonFoil": true,
        "isMtgo": true,
        "isPaper": true,
        "isPromo": true,
        "isStarter": true,
        "layout": "adventure",
        "manaCost": "{2}{U}",
        "name": "Bring to Life",
        "number": "280",
        "otherFaceIds": ["282a6d14-05e0-55fd-bb84-f8a4212cac36", "f4db9eb8-3d82-5f79-98c5-c3945cbb22ca", "88715bd2-8b80-5278-938d-814c153ec768"],
        "printings": ["ELD"],
        "rarity": "uncommon",
        "side": "b",
        "subtypes": ["Adventure"],
        "supertypes": [],
        "tcgplayerProductId": 198560,
        "text": "Target noncreature artifact you control becomes a 0/0 artifact creature. Put four +1/+1 counters on it.",
        "type": "Sorcery — Adventure",
        "types": ["Sorcery"],
        "uuid": "9f08d4be-a5c4-5015-b369-1c82e182e2df",
      };
      const [parsedCard] = [adventureCard].map(toBoosterCard("setCode"));
      assert(parsedCard.name === "Bring to Life", "Adventure card should not have names linked with //");
    });

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
        "number": "126",
        "otherFaceIds": ["f1701b93-065a-54ca-9a96-a924b7312801"],
        "printings": ["DGM"],
        "rarity": "uncommon",
        "identifiers": {"scryfallId": "c35c63c1-6344-4d8c-8f7d-cd253d12f9ae"},
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
        "number": "126",
        "otherFaceIds": ["c6875787-16eb-5199-bd1e-586dd759171e"],
        "printings": ["DGM"],
        "rarity": "uncommon",
        "identifiers": {"scryfallId": "c35c63c1-6344-4d8c-8f7d-cd253d12f9ae"},
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

    it("parse a split card with correct colors", () => {
      const ice = {
        "colorIdentity": ["R", "U"],
        "colors": ["U"],
        "convertedManaCost": 4.0,
        "layout": "split",
        "manaCost": "{1}{U}",
        "name": "Fire // Ice",
        "faceName": "Ice",
        "otherFaceIds": ["0ad9df53-068e-5bbd-9a83-d0dc4168ce6e"],
        "number": "128",
        "rarity": "uncommon",
        "identifiers": {"scryfallId": "f98f4538-5b5b-475d-b98f-49d01dae6f04"},
        "side": "b",
        "subtypes": [],
        "supertypes": [],
        "text": "Tap target permanent.\nDraw a card.",
        "type": "Instant",
        "types": ["Instant"],
        "uuid": "3fe4b8e5-54dd-538d-b891-6016547aff15"
      };
      const fire = {
        "colorIdentity": ["R", "U"],
        "colors": ["R"],
        "convertedManaCost": 4.0,
        "layout": "split",
        "manaCost": "{1}{R}",
        "name": "Fire // Ice",
        "faceName": "Fire",
        "otherFaceIds": ["d6bfcef0-7cb3-5651-b110-0e6ff432a887"],
        "number": "128",
        "rarity": "uncommon",
        "identifiers": {"scryfallId": "f98f4538-5b5b-475d-b98f-49d01dae6f04"},
        "side": "a",
        "subtypes": [],
        "supertypes": [],
        "text": "Fire deals 2 damage divided as you choose among one or two targets.",
        "type": "Instant",
        "types": ["Instant"],
        "uuid": "bcef8350-ed57-5e3a-bffe-a3f9d955512e"
      };

      const [iceParsed, fireParsed] = [ice, fire].map(toBoosterCard("setCode"));
      assert.equal(iceParsed.color, "Multicolor", "A split card’s colors are determined from its combined mana cost");
      assert.equal(fireParsed.color, "Multicolor", "A split card’s colors are determined from its combined mana cost");
    });

    it("parse a card with multiple color identities as mono color", () => {
      const multicolorCard = {
        "colorIdentity": ["B", "R"],
        "colors": ["R"],
        "convertedManaCost": 5.0,
        "layout": "normal",
        "manaCost": "{4}{R}",
        "multiverseId": 442138,
        "name": "Skeletonize",
        "otherFaceIds": [],
        "number": "149",
        "rarity": "common",
        "identifiers": {"scryfallId": "b47ce40e-23e3-47e7-a900-c77c12f122a5"},
        "subtypes": [],
        "supertypes": [],
        "text": "Skeletonize deals 3 damage to target creature. When a creature dealt damage this way dies this turn, create a 1/1 black Skeleton creature token with \"{B}: Regenerate this creature.\"",
        "type": "Instant",
        "types": ["Instant"],
        "uuid": "cd36cdce-c9e7-59f8-a439-e3d3f5dca13d",
      };

      const [parsedCard] = [multicolorCard].map(toBoosterCard("setCode"));
      assert(parsedCard.color === "Red", "multicolored card should have color red");
    });

    it("parse a no color card as colorless", () => {
      const artifact = {
        "colorIdentity": [],
        "colors": [],
        "convertedManaCost": 4.0,
        "manaCost": "{4}",
        "name": "Aligned Hedron Network",
        "number": "222",
        "rarity": "rare",
        "subtypes": [],
        "supertypes": [],
        "text": "When Aligned Hedron Network enters the battlefield, exile all creatures with power 5 or greater until Aligned Hedron Network leaves the battlefield. (Those creatures return under their owners' control.)",
        "type": "Artifact",
        "types": ["Artifact"],
        "uuid": "11a24350-bfdc-5d8c-addb-571c2aace8dc"
      };
      const [parsedCard] = [artifact].map(toBoosterCard("setCode"));
      assert(parsedCard.color === "Colorless", "colorless card should have color Colorless");
    });
  });
});
