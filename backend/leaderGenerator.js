const {getCardByUuid, getSet} = require("./data");
const {sampleSize} = require("lodash");


const makeLeaderBooster = (setCodes) => {
  return setCodes.map(getSet).map(set => sampleSize(set.Leader, 1)).map(getCardByUuid);
};

module.exports = makeLeaderBooster;
