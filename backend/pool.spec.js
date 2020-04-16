/* eslint-env node, mocha */

const assert = require("assert");
const Pool = require("./pool");
const {range, times, constant} = require("lodash");
const { getPlayableSets } = require("./data");

describe("Acceptance tests for Pool class", () => {
  describe("can make a cube pool", () => {
    it("should return a sealed cube pool with length equal to player length", () => {
      const cubeList = times(720, constant("island"));
      const playersLength = 8;
      const got = Pool.SealedCube({ cubeList, playersLength });
      assert.equal(playersLength, got.length);
      got.forEach(pool => pool.forEach(card => assert(card.name != undefined)));
      got.forEach(pool => pool.forEach(card => assert(card.draftId != undefined)));
    });

    it("should return a draft cube pool with length equal to player length per playersPack", () => {
      const cubeList = times(720, constant("island"));
      const playersLength = 8;
      const packsNumber = 3;
      const got = Pool.DraftCube({ cubeList, playersLength, packsNumber });
      assert.equal(playersLength*packsNumber, got.length);
      got.forEach(pool => pool.forEach(card => assert(card.name != undefined)));
      got.forEach(pool => pool.forEach(card => assert(card.draftId != undefined)));
    });
  });

  describe("can make a normal pool", () => {
    it("should return a sealed pool with length equal to player length", () => {
      const sets = times(6, constant("M19"));
      const playersLength = 8;
      const got = Pool.SealedNormal({ sets, playersLength });
      assert.equal(playersLength, got.length);
      got.forEach(pool => pool.forEach(card => assert(card.name != undefined)));
      got.forEach(pool => pool.forEach(card => assert(card.draftId != undefined)));
    });

    it("should return a draft pool with length equal to player length per playersPack", () => {
      const sets = times(3, constant("M19"));
      const playersLength = 8;
      const got = Pool.DraftNormal({ sets, playersLength });
      assert.equal(playersLength * 3, got.length);
      got.forEach(pool => pool.forEach(card => assert(card.name != undefined)));
      got.forEach(pool => pool.forEach(card => assert(card.draftId != undefined)));
    });
  });

  describe("can make a chaos pool", () => {
    it("should return a sealed chaos pool with length equal to player length", () => {
      const playersLength = 8;
      const got = Pool.SealedChaos({ modernOnly: true, totalChaos: true, playersLength });
      assert.equal(playersLength, got.length);
      got.forEach(pool => pool.forEach(card => assert(card.name != undefined)));
      got.forEach(pool => pool.forEach(card => assert(card.draftId != undefined)));
    });

    it("should return a draft chaos pool with length equal to player length per playersPack", () => {
      const playersLength = 8;
      const got = Pool.DraftChaos({ modernOnly: true, totalChaos: true, playersLength });
      assert.equal(playersLength * 3, got.length);
      got.forEach(pool => pool.forEach(card => assert(card.name != undefined)));
      got.forEach(pool => pool.forEach(card => assert(card.draftId != undefined)));
    });
  });

  describe("can make a TimeSpiral pool", () => {
    it("should return a timespiral pool", () => {
      const [got] = Pool.DraftNormal({playersLength: 1, sets: ["TSP"]});
      assert.equal(got.length, 15);
      got.forEach(card => assert(card.name != undefined));
      got.forEach(card => assert(card.draftId != undefined));
    });
  });

  describe("can make all playable sets", () => {
    it("should return a normal booster", () => {
      const playableSets = getPlayableSets();
      Object.values(playableSets).forEach((sets) => {
        sets.forEach(({code, releaseDate}) => {
          if (code === "random" || Date.parse(releaseDate) > new Date() || code === "UST") {
            return;
          }
          const [got] = Pool.DraftNormal({playersLength: 1, sets: [code]});
          got.forEach(card => assert(card.name != undefined, `${code} has an error: ${card}`));
          got.forEach(card => assert(card.draftId != undefined));
        });
      });
    });
  });
  describe("EMN boosters do not have cards in multiple", () => {
    it("1000 EMN boosters don't have cards in multiple unless double faced card", () => {
      range(1000).forEach(() => {
        const [got] = Pool.DraftNormal({playersLength: 1, sets: ["EMN"]});
        got.forEach(card => {
          const isMultiple = got.filter(c => c.name === card.name && !c.foil).length > 1;
          const isSpecial = card.rarity === "special" || card.isDoubleFaced || card.foil;
          assert(!isMultiple || isSpecial, `${card.name} is in multiple and was not special`);
        });
      });
    });
  });
});
