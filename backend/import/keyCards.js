const keyBy = (getGroup, getValue, cards = []) => (
  cards.reduce((acc, card) => {
    acc[getGroup(card)] = getValue(card);
    return acc;
  }, {})
);

const groupCardsBy = (getGroup, getValue, baseSetSize = 0, cards = []) => (
  cards.reduce((acc, card) => {
    if (baseSetSize >= card.number) {
      const group = getGroup(card);
      (acc[group] = acc[group] || []).push(getValue(card));
    }
    return acc;
  }, {})
);

const rarityPlucker = ({rarity}) => rarity;
const numberPlucker = ({number}) => number;
const uuidPlucker = ({uuid}) => uuid;
const namePlucker = ({name}) => name.toLowerCase();

const groupCardsUuidByRarity = (baseSetSize = 0, cards = []) =>
  groupCardsBy(rarityPlucker, uuidPlucker, baseSetSize, cards);

const groupCardsByName = (cards = []) =>
  groupCardsBy(namePlucker, card => card, 10000, cards);

const keyCardsUuidByNumber = (cards = []) =>
  keyBy(numberPlucker, uuidPlucker, cards);

const keyCardsByName = (cards = []) =>
  keyBy(namePlucker, card => card, cards);

const keyCardsByUuid = (cards = []) =>
  keyBy(uuidPlucker, card => card, cards);

module.exports = {
  groupCardsUuidByRarity,
  groupCardsByName,
  keyCardsUuidByNumber,
  keyCardsByName,
  keyCardsByUuid
};
