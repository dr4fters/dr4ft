const keyBy = (getGroup, getValue, cards = []) => (
  cards.reduce((acc, card) => {
    acc[getGroup(card)] = getValue(card);
    return acc;
  }, {})
);

const groupCardsBy = (getGroup, getValue, cards = []) => (
  cards.reduce((acc, card) => {
    const group = getGroup(card);
    (acc[group] = acc[group] || []).push(getValue(card));
    return acc;
  }, {})
);

const rarityPlucker = ({rarity}) => rarity;
const numberPlucker = ({number}) => number;
const uuidPlucker = ({uuid}) => uuid;
const namePlucker = ({name}) => name.toLowerCase();

const groupCardsUuidByRarity = (cards = []) =>
  groupCardsBy(rarityPlucker, uuidPlucker,cards);

const groupCardsByName = (cards = []) =>
  groupCardsBy(namePlucker, card => card, cards);

const keyCardsUuidByNumber = (cards = []) =>
  keyBy(numberPlucker, uuidPlucker, cards);

const keyCardsUuidByName = (cards = []) =>
  keyBy(namePlucker, uuidPlucker, cards);

const keyCardsByUuid = (cards = []) =>
  keyBy(uuidPlucker, card => card, cards);

module.exports = {
  groupCardsUuidByRarity,
  groupCardsByName,
  keyCardsUuidByNumber,
  keyCardsUuidByName,
  keyCardsByUuid
};
