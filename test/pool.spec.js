/* eslint-env node, mocha */
const assert = require("assert");
const Pool = require("../src/pool");

describe("Acceptance tests for Pool class", () => {
  describe("can make a cube pool", () => {
    it("should return a sealed cube pool with length equal to player length", () => {
      const cubeList = new Array(720).fill("island");
      const playersLength = 8;
      const got = Pool.SealedCubePool({ cubeList, playersLength });
      assert.equal(playersLength, got.length);
    });

    it("should return a draft cube pool with length equal to player length per playersPack", () => {
      const cubeList = new Array(720).fill("island");
      const playersLength = 8;
      const packsNumber = 3;
      const got = Pool.DraftCubePool({ cubeList, playersLength, packsNumber });
      assert.equal(playersLength*packsNumber, got.length);
    });
  });
  
  describe("can make a normal pool", () => {
    it("should return a sealed pool with length equal to player length", () => {
      const sets = new Array(6).fill("M19");
      const playersLength = 8;
      const got = Pool.SealedNormal({ sets, playersLength });
      assert.equal(playersLength, got.length);
    });

    it("should return a draft pool with length equal to player length per playersPack", () => {
      const sets = new Array(3).fill("M19");
      const playersLength = 8;
      const got = Pool.DraftNormal({ sets, playersLength });
      assert.equal(playersLength * 3, got.length);
    });
  });

  describe("can make a chaos pool", () => {
    it("should return a sealed chaos pool with length equal to player length", () => {
      const playersLength = 8;
      const got = Pool.SealedChaos({ modernOnly: true, totalChaos: true, playersLength });
      assert.equal(playersLength, got.length);
    });

    it("should return a draft chaos pool with length equal to player length per playersPack", () => {
      const playersLength = 8;
      const got = Pool.SealedChaos({ modernOnly: true, totalChaos: true, playersLength });
      assert.equal(playersLength, got.length);
    });
  });
});

describe("Set tests for Pool class", () => {
  describe("can make a WAR Pool", () => {
    it("should return a pack of 14 cards", () => {
      const got = Pool.DraftNormal({playersLength: 1, sets: ["WAR"]});
      assert.equal(14, got[0].length);
    });
    it("should return a pack without guildgates", () => {
      const got = Pool.DraftNormal({playersLength: 1, sets: new Array(20).fill("WAR")});
      assert.equal(0, got[0].flat().filter(({type, rarity}) => type === "Land" && rarity == "common").length);
    });
    it("should return a pack with at least one planeswalker", () => {
      const got = Pool.DraftNormal({playersLength: 1, sets: new Array(20).fill("WAR")});
      got.forEach(pack => {
        const numberOfPws = pack.filter(({type}) => type === "Planeswalker").length;
        if (numberOfPws == 0) {
          assert.fail("No Planeswalker were found in the pack");
        }
      });
    });
    it("should return a pack with at most one planeswalker", () => {
      const got = Pool.DraftNormal({playersLength: 1, sets: new Array(20).fill("WAR")});
      got.forEach(pack => {
        const numberOfPws = pack.filter(({type}) => type === "Planeswalker").length;
        if (numberOfPws > 1) {
          const isPlaneswalker = card => {
            return card.type === "Planeswalker";
          };
          const isRareOrMythic = ({rarity, foil}) => !foil && ["mythic", "rare"].includes(rarity);
          const isUnco = ({rarity, foil}) => !foil && rarity === "uncommon";

          const isRareAPw = pack.filter(isRareOrMythic).filter(isPlaneswalker).length > 0;
          const isUncoAPw = pack.filter(isUnco).filter(isPlaneswalker).length > 0;
          if (isRareAPw && isUncoAPw) {
            assert.fail(`Too many Pws were found in the pack : ${numberOfPws}`);
          }

          if (!isRareAPw) {
            assert.fail(`Too many Pws in uncommons were found in the pack : ${numberOfPws}`);
          }
        }
      });
    });

  });
});