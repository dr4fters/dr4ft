function groupCardByProperty(baseSetSize = 0, cards = [], getGroup, prop = "name") {
  return cards.reduce((acc, card) => {
    if (baseSetSize >= card.number) {
      const group = getGroup(card);
      (acc[group] = acc[group] || []).push(card[prop]);
    }
    return acc;
  }, {});
}

const rarityPlucker = ({rarity}) => rarity;
const numberPlucker = ({number}) => number;

const groupCardNamesByRarity = (baseSetSize = 0, cards = []) =>
  groupCardByProperty(baseSetSize, cards, rarityPlucker);

const groupCardUuidByNumber = (baseSetSize = 0, cards = []) =>
  groupCardByProperty(baseSetSize, cards, numberPlucker, "uuid");


const frameEffectAwareGroup = frameEffect => ({frameEffects = [], rarity}) => {
  if (frameEffects.includes(frameEffect))
    return `special_${rarity}`;
  else
    return rarity;
};


const subtypeAwareGroup = subtype => ({subtypes = [], rarity}) => {
  if (subtypes.includes(subtype))
    return `special_${rarity}`;
  else
    return rarity;
};


const EMNStyle = frameEffectAwareGroup("mooneldrazidfc");
const SOIStyle = frameEffectAwareGroup("sunmoondfc");
const guildgateGroup = subtypeAwareGroup("Gate");

module.exports = {
  groupCardNamesByRarity,
  groupCardUuidByNumber
};
