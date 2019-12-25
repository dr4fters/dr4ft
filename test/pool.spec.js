/* eslint-env node, mocha */
const assert = require("assert");
const Pool = require("../src/pool");
const { getPlayableSets } = require("../src/data");

describe("Acceptance tests for Pool class", () => {
  describe("can make a cube pool", () => {
    it("should return a sealed cube pool with length equal to player length", () => {
      const cubeList = new Array(720).fill("island");
      const playersLength = 8;
      const got = Pool.SealedCube({ cubeList, playersLength });
      assert.equal(playersLength, got.length);
    });

    it("should return a draft cube pool with length equal to player length per playersPack", () => {
      const cubeList = new Array(720).fill("island");
      const playersLength = 8;
      const packsNumber = 3;
      const got = Pool.DraftCube({ cubeList, playersLength, packsNumber });
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
      const got = Pool.DraftChaos({ modernOnly: true, totalChaos: true, playersLength });
      assert.equal(playersLength * 3, got.length);
    });
  });

  describe("can make a TimeSpiral pool", () => {
    it("should return a timespiral pool", () => {
      const got = Pool.DraftNormal({playersLength: 1, sets: ["TSP"]});
      assert.equal(got[0].length, 14);
    });
  });

  describe("can make all playable sets", () => {
    it("should return a normal booster", () => {
      const playableSets = getPlayableSets();
      Object.values(playableSets).forEach((sets) => {
        sets.forEach(({code, releaseDate}) => {
          if (code === "random" || Date.parse(releaseDate) > new Date()) {
            return;
          }
          const [got] = Pool.DraftNormal({playersLength: 1, sets: [code]});
          got.forEach(card => {
            assert.ok(card.name, `${code} has an error: ${card}`);
          });
        });
      });
    });
  });
});
