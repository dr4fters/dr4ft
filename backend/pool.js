const {times, constant} = require("lodash");
const boosterGenerator = require("./boosterGenerator");
const makeLeaderBooster = require("./leaderGenerator");
const draftId = require("uuid").v1;

/**
 * @desc add a unique id to a card
 * @param card
 * @returns {{...card, cardId: string}}
 */
const addCardId = (card) => ({
  ...card,
  cardId: draftId()
});

const addCardIdsToBoosterCards = (pack) => pack.map(addCardId);


const SealedNormal = ({ playersLength, sets }) => (
  times(playersLength , constant(sets))
    .map(sets => sets.flatMap(boosterGenerator))
    .map(addCardIdsToBoosterCards)
);

const DraftNormal = ({ playersLength, sets }) => (
  [...times(playersLength, constant(sets))
    .map(makeLeaderBooster)
    .map(addCardIdsToBoosterCards),
  ...sets.flatMap(set => times(playersLength, constant(set)))
    .map(boosterGenerator)
    .map(addCardIdsToBoosterCards)]
);

module.exports = {
  SealedNormal,
  DraftNormal
};
