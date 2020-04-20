/* eslint-env node, mocha */

const assert = require("assert");
const Pool = require("./pool");
const {range, times, constant} = require("lodash");
const {getPlayableSets} = require("./data");

const assertPackIsCorrect = (got) => {
  const cardIds = new Set();
  let expectedCardsSize = 0;
  got.forEach(pool => pool.forEach(card => {
    assert(card.name !== undefined);
    assert(card.cardId !== undefined);
    cardIds.add(card.cardId);
    expectedCardsSize++;
  }));
  assert.equal(cardIds.size, expectedCardsSize, "cards should all have a unique ID");
};

describe("Acceptance tests for Pool class", () => {
  describe("can make a cube pool", () => {
    it("should return a sealed cube pool with length equal to player length", () => {
      const cubeList = times(720, constant("island"));
      const playersLength = 8;
      const playerPoolSize = 90;
      const got = Pool.SealedCube({cubeList, playersLength, playerPoolSize});
      assert.equal(got.length, playersLength);
      assertPackIsCorrect(got);
    });

    it("should return a draft cube pool with length equal to player length per playersPack", () => {
      const cubeList = times(720, constant("island"));
      const playersLength = 8;
      const packsNumber = 3;
      const playerPackSize = 15;
      const got = Pool.DraftCube({cubeList, playersLength, packsNumber, playerPackSize});
      assert.equal(got.length, playersLength * packsNumber);
      assertPackIsCorrect(got);
    });
  });

  describe("can make a normal pool", () => {
    it("should return a sealed pool with length equal to player length", () => {
      const packsNumber = 6;
      const sets = times(packsNumber, constant("M19"));
      const playersLength = 8;
      const got = Pool.SealedNormal({sets, playersLength});
      assert.equal(got.length, playersLength);
      assertPackIsCorrect(got);
    });

    it("should return a draft pool with length equal to player length per playersPack", () => {
      const packsNumber = 3;
      const sets = times(packsNumber, constant("M19"));
      const playersLength = 8;
      const got = Pool.DraftNormal({sets, playersLength});
      assert.equal(got.length, playersLength * packsNumber);
      assertPackIsCorrect(got);
    });
  });

  describe("can make a chaos pool", () => {
    it("should return a sealed chaos pool with length equal to player length", () => {
      const playersLength = 8;
      const got = Pool.SealedChaos({ modernOnly: true, totalChaos: true, playersLength });
      assert.equal(got.length, playersLength);
      assertPackIsCorrect(got);
    });

    it("should return a draft chaos pool with length equal to player length per playersPack", () => {
      const playersLength = 8;
      const packsNumber = 3;
      const got = Pool.DraftChaos({packsNumber, modernOnly: true, totalChaos: true, playersLength});
      assert.equal(got.length, playersLength * packsNumber);
      assertPackIsCorrect(got);
    });
  });

  describe("can make a TimeSpiral pool", () => {
    it("should return a timespiral pool", () => {
      const [got] = Pool.DraftNormal({playersLength: 1, sets: ["TSP"]});
      assert.equal(got.length, 15);
      assertPackIsCorrect([got]);
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
          const got = Pool.DraftNormal({playersLength: 1, sets: [code]});
          assertPackIsCorrect(got);
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
