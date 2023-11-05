const { sample, pull, times, shuffle } = require("lodash");
const pileSort = require("pile-sort");

const RARITY_ORDER = ["Mythic", "Rare", "Uncommon", "Common", "Basic"];
function sortByRarity (cards) {
  return shuffle(cards).sort((a, b) => {
    return RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity);
  });
}

const decidingPicksNumber = 6;
function samplePick (pack, pool, myColors) {
  if (pool.length === decidingPicksNumber) {
    const colorCount = pool.reduce(
      (acc, pack) => {
        pack.colorIdentity.forEach(color => { acc[color] += 1; });
        return acc;
      },
      {
        W: 0,
        U: 0,
        B: 0,
        R: 0,
        G: 0
        // TODO count colourless?
      }
    );

    const countColors = Object.keys(colorCount).reduce(
      (acc, color) => {
        const count = colorCount[color];
        if (!acc[count]) {
          acc[count] = [];
        }
        acc[count].push(color);
        return acc;
      },
      {}
    );
    const orderedColors = Object.values(countColors)
      .reduce(
        (acc, next) => {
          return [...acc, ...shuffle(next)];
        },
        []
      );

    myColors.clear();
    orderedColors.slice(0, 2).forEach(color => myColors.add(color));
  }

  const [cardsInMyColors, cardsNotInMyColors] = pileSort(pack, [
    card => {
      return (
        card.colorIdentity.length === 0 ||
        card.colorIdentity.some(color => myColors.has(color))
        // NOTE: this means if you if your colors are WU, you can find your bot
        // picks a WG card (they match on W and are splashing?)
      );
    }
  ]);

  const orderedPicks = sortByRarity(cardsInMyColors);
  if (orderedPicks.length) return orderedPicks[0];

  return sortByRarity(cardsNotInMyColors)[0];
}

const Player = require("./index");
const logger = require("../logger");

module.exports = class Bot extends Player {
  constructor(picksPerPack, burnsPerPack, gameId) {
    super({
      isBot: true,
      isConnected: true,
      name: "bot",
      id: "",
    });
    this.gameId= gameId;
    this.picksPerPack = picksPerPack;
    this.burnsPerPack = burnsPerPack;

    this.myColors = new Set(["W", "U", "B", "R", "G"]); // bot chooses 2 colors at some point
  }

  getPack(pack) {
    const cardsToPick = Math.min(this.picksPerPack, pack.length);
    times(cardsToPick, () => {
      const card = samplePick(pack, this.pool, this.myColors);
      logger.info(`GameID: ${this.gameId}, Bot, picked: ${card.name}`);
      this.pool.push(card);
      this.picks.push(card.name);
      pull(pack, card);
    });

    // burn cards
    const cardsToBurn = Math.min(this.burnsPerPack, pack.length);
    times(cardsToBurn, () => {
      const randomPick = sample(pack);
      logger.info(`GameID: ${this.gameId}, Bot, burnt: ${randomPick.name}`);
      pull(pack, randomPick);
    });

    this.emit("pass", pack);
  }
};
