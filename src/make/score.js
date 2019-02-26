const fs = require("fs");
const logger = require("../logger");
const { getCards, writeCards } = require("../data");
const SCORE_PATH = "./data/scores.json";

if (!fs.existsSync(SCORE_PATH)) {
  logger.error(`Score file not present at ${SCORE_PATH}. Aborting`);
} else {
  try {
    const scores = JSON.parse(fs.readFileSync(SCORE_PATH));
    const Cards = getCards();

    for (const row of scores.rows) {
      const { key, value: { sum, count } } = row;
      const lc = key.toLowerCase();
      if (!(lc in Cards)) {
        logger.error(`Can't find card ${lc} in our DB`);
        continue;
      }
      Cards[lc].score = sum / count;
    }

    writeCards(Cards);
  } catch(err) {
    logger.err(`Error while updating scores: ${err.stack}`);
  }
 
}
