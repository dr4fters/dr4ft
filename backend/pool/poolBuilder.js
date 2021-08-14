const Pool = require("./pool");
const { truncate } = require("lodash");

/**
 * @brief Manages parameters that control the type, grouping and quantity of cards in a pool
 */
module.exports = class PoolBuilder {
  /**
   *
   * @param {string} type
   *  Format + Pool desciption enum provided by frontend
   * @param {string[]} sets
   *  List of set tags describing the packs that should be used by a single player
   * @param {object} cube
   *  Cube options object generated in frontend
   *  {list, cards, packs, cubePoolSize, burnsPerPack}
   * @param {boolean} modernOnly
   *  If true, chaos packs are composed exclusively of modern cards
   * @param {boolean} totalChaos
   *  If true, chaos packs are composed of cards from randomly selected sets
   * @param {int} chaosPacksNumber
   *  How many packs to use if this is a chaos draft
   */
  constructor(type, sets, cube, modernOnly, totalChaos, chaosPacksNumber) {
    this.type = type;
    this.cube = cube;
    this.modernOnly = modernOnly;
    this.totalChaos = totalChaos;
    this.chaosPacksNumber = chaosPacksNumber;
    this.setTypes = sets || [];
  }

  /**
   * Create a pool of cards to play with
   * @param {int} playersLength
   *  How many players are participating in this pool
   * @returns
   *  ... not sure?
   *  Looks like an array of arrays of... something?
   */
  createPool(playersLength) {
    switch (this.type) {
    case "cube draft":
      return Pool.DraftCube({
        cubeList: this.cube.list,
        playersLength: playersLength,
        packsNumber: this.cube.packs,
        playerPackSize: this.cube.cards
      });
    case "cube sealed":
      return Pool.SealedCube({
        cubeList: this.cube.list,
        playersLength: playersLength,
        playerPoolSize: this.cube.cubePoolSize
      });
    case "draft":
    case "decadent draft":
      return Pool.DraftNormal({
        playersLength: playersLength,
        sets: this.setTypes
      });
    case "sealed":
      return Pool.SealedNormal({
        playersLength: playersLength,
        sets: this.setTypes
      });
    case "chaos draft":
      return Pool.DraftChaos({
        playersLength: playersLength,
        packsNumber: this.chaosPacksNumber,
        modernOnly: this.modernOnly,
        totalChaos: this.totalChaos
      });
    case "chaos sealed":
      return Pool.SealedChaos({
        playersLength: playersLength,
        packsNumber: this.chaosPacksNumber,
        modernOnly: this.modernOnly,
        totalChaos: this.totalChaos
      });
    default: throw new Error(`Type ${this.type} not recognized`);
    }
  }

  /**
   * @returns {string}
   *    A string describing the configuration of this pool
   *    (i.e. what cards are in this pool?)
   */
  get info() {
    switch (this.type) {
    case "draft":
    case "sealed":
      return this.setTypes.join(" / ");
    case "decadent draft":
      // Sets should all be the same and there can be a large number of them.
      // Compress this info into e.g. "36x IKO" instead of "IKO / IKO / ...".
      return `${this.setTypes.length}x ${this.setTypes[0]}`;
    case "cube draft":
      var packsInfo = `${this.cube.packs} packs with ${this.cube.cards} cards from a pool of ${this.cube.list.length} cards`;
      if (this.cube.burnsPerPack > 0) {
        packsInfo += ` and ${this.cube.burnsPerPack} cards to burn per pack`;
      }
      return packsInfo;
    case "cube sealed":
      return `${this.cube.cubePoolSize} cards per player from a pool of ${this.cube.list.length} cards`;
    case "chaos draft":
    case "chaos sealed":
      var chaosOptions = [];
      chaosOptions.push(`${this.chaosPacksNumber} Packs`);
      chaosOptions.push(this.modernOnly ? "Modern sets only" : "Not modern sets only");
      chaosOptions.push(this.totalChaos ? "Total Chaos" : "Not Total Chaos");
      return `${chaosOptions.join(", ")}`;
    default:
      return "";
    }
  }

  /**
   * @returns {int}
   *  The number of draft rounds that should be done to consume this pool
   */
  get rounds() {
    switch (this.type) {
    case "draft":
    case "decadent draft":
      return this.setTypes.length;
    case "cube draft":
      return this.cube.packs;
    case "chaos draft":
      return this.chaosPacksNumber;
    default:
      return 0;
    }
  }

  /**
   * @returns {int}
   *  The number of burn cards that should be done on each draft pick
   *  (implicit here meaning both burns done in the frontend or the backend)
   */
  get implicitBurnsPerPack() {
    switch (this.type) {
    case "decadent draft":
      return Number.MAX_VALUE;
    case "cube draft":
      return this.cube.burnsPerPack;
    default:
      return 0;
    }
  }

  /**
   * @returns {int}
   *  The number of burn cards that should be done on each draft pick
   *  (explicit here meaning both burns done in the frontend)
   */
  get explicitBurnsPerPack() {
    switch (this.type) {
    case "decadent draft":
      // Decadent drafts implicitly burn the rest of the pack, we don't need
      // to make the user select them all
      return 0;
    default:
      return this.implicitBurnsPerPack;
    }
  }

  /**
   * @returns {string[]}
   *  A list of sets used to create the packs for a player in this draft.
   *  Empty list if invalid.
   */
  get sets() {
    return this.setTypes;
  }

  /**
   * @returns {boolean}
   *  true if this pool is backed by a cube set
   */
  get isCube() {
    return this.cube ? true : false;
  }

  /**
   * @returns {string[]}
   *  A list of all the cards in the cube pool for this draft.
   *  Empty list if invalid.
   */
  get cubeList() {
    return this.cube ? this.cube.list : [];
  }

  /**
   * @returns {string}
   *  Get a debug string representation of this object
   */
  toString() {
    return `
    Pool Builder
    ----------
    type: ${this.type}
    sets: ${this.setTypes}
    modernOnly: ${this.modernOnly}
    totalChaos: ${this.totalChaos}
    chaosPacksNumber: ${this.chaosPacksNumber}
    info: ${this.info}
    ${this.cube ?
    `cubePoolSize: ${this.cube.cubePoolSize}
    packsNumber: ${this.cube.packs}
    playerPackSize: ${this.cube.cards}
    cube: ${truncate(this.cube.list, 30)}`
    : ""}`;
  }

};
