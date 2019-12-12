/* eslint-env node, mocha */
const assert = require("assert");
const Game = require("../src/game");

describe("Acceptance tests for Game class", () => {
  describe("can make a game", () => {
    it("should return a new draft", async () => {
      const gameParams = {
        hostId: "1", title: "test game", seats: 8, type: "draft", sets: ["GRN", "GRN", "GRN"],
        cube: null, isPrivate: true, modernOnly: false, totalChaos: false
      };

      const got = new Game(gameParams);
      assert.equal(got.type, "draft");
    });
  });
  describe("can make a draft with 4 sets", () => {
    it("should return a game with 4 round", async () => {
      const gameParams = {
        hostId: "1", title: "test game", seats: 8, type: "draft", sets: ["GRN", "GRN", "GRN", "GRN"],
        cube: null, isPrivate: true, modernOnly: false, totalChaos: false
      };

      const got = new Game(gameParams);
      assert.equal(got.rounds, 4);
    });
  });
});
