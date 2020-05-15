/* eslint-env node, mocha */
const assert = require("assert");
const Game = require("./game");
const Sock = require("./sock");
const Rooms = require("./rooms");


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
  describe("can only show roomInfo about public games", () => {
    it("should return a roomInfo about a public game not started and active", () => {
      const gameParams = {
        hostId: "1", title: "test game", seats: 8, type: "draft", sets: ["GRN", "GRN", "GRN", "GRN"],
        cube: null, isPrivate: false, modernOnly: false, totalChaos: false
      };

      const game = new Game(gameParams);
      const ws = {
        on: () => {},
        send: () => {},
        request: { _query: {}}
      };
      const sock = new Sock(ws);
      game.join(sock);
      const [got] = Game.getRoomInfo();
      Rooms.delete(game.id);
      assert.equal(game.id, got.id);
    });
    it("should not return a roomInfo about a game started", () => {
      const gameParams = {
        hostId: "1", title: "test game", seats: 8, type: "draft", sets: ["GRN", "GRN", "GRN", "GRN"],
        cube: null, isPrivate: false, modernOnly: false, totalChaos: false
      };

      const game = new Game(gameParams);
      game.round = -1;
      const got = Game.getRoomInfo();
      Rooms.delete(game.id);
      assert.equal(0, got.length);
    });
    it("should not return a roomInfo about a game inactive", () => {
      const gameParams = {
        hostId: "1", title: "test game", seats: 8, type: "draft", sets: ["GRN", "GRN", "GRN", "GRN"],
        cube: null, isPrivate: false, modernOnly: false, totalChaos: false
      };

      const game = new Game(gameParams);
      game.round = -1;
      const got = Game.getRoomInfo();
      Rooms.delete(game.id);
      assert.equal(0, got.length);
    });
  });
});
