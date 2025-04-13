const axios = require("axios");
const logger = require("../backend/logger");
const {getBoosterRulesVersion, getCardByUuid, getSet, saveBoosterRules} = require("../backend/data");

const URL = "https://raw.githubusercontent.com/taw/magic-sealed-data/master/sealed_basic_data.json";
const REPO_URL = "https://api.github.com/repos/taw/magic-sealed-data/git/refs/heads/master";

const CardsByColorInitial = () => ({
  W: [],
  B: [],
  U: [],
  R: [],
  G: [],
  c: []
});

async function fetch() {
  logger.info("Checking boosterRules repository");
  const repo = await axios.get(REPO_URL);
  const sha = repo.data.object.sha;
  const currentBoosterRulesVersion = getBoosterRulesVersion();
  if (currentBoosterRulesVersion === sha) {
    logger.info(`Found same boosterRules version (${currentBoosterRulesVersion}). Skip new download`);
    return;
  }
  logger.info(`Found diverse boosterRules version (current: ${currentBoosterRulesVersion} new: ${sha})`);
  const resp = await axios.get(URL);
  logger.info("Finished download of new boosterRules");
  const rules = resp.data.reduce((acc, { code, boosters, sheets }) => {
    const totalWeight = boosters.reduce((acc, { weight }) => acc + weight, 0);

    acc[code.toUpperCase()] = {
      totalWeight,
      boosters,
      sheets: Object.entries(sheets).reduce((acc, [code, {balance_colors = false, cards}]) => {
        const totalWeight = Object.values(cards).reduce((acc, val) => acc + val, 0);
        acc[code] = {
          balance_colors,
          totalWeight,
          cards: Object.entries(cards).reduce((acc, [cardCode, weight]) => {
            const uuid = getUuid(cardCode);
            if (uuid) acc[uuid] = weight;
            return acc;
          },{}),
          cardsByColor: Object.entries(cards).reduce((acc, [cardCode]) => {
            try {
              const {uuid, colorIdentity, type} = getCard(cardCode);
              if (type === "Land" || colorIdentity.length === 0) {
                acc["c"].push(uuid);
              } else {
                colorIdentity.forEach((color) => {
                  acc[color].push(uuid);
                });
              }
            } catch(err) {
              logger.warn(cardCode + " doesn't match any card");
            }
            return acc;
          }, CardsByColorInitial())
        };
        return acc;
      }, {}),
    };

    return acc;
  }, {});
  rules.repoHash = sha;
  logger.info("Saving boosterRules");
  saveBoosterRules(rules);
  logger.info("Finished saving boosterRules");
}

const getCard = (cardCode) => {
  const uuid = getUuid(cardCode);
  return getCardByUuid(uuid);
};

const getUuid = (cardCode) => {
  const [setCode, cardNumber] = cardCode.split(":");
  const set = getSet(setCode);
  if (!set) {
    logger.warn("unknown setCode: " + setCode.toUpperCase());
    return;
  }
  return set.cardsByNumber[cardNumber] || set.cardsByNumber[parseInt(cardNumber)] || set.cardsByNumber[cardNumber.toLowerCase()];
};

module.exports = fetch;

//Allow this script to be called directly from commandline.
if (!module.parent) {
  fetch();
}
