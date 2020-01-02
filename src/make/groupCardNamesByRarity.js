function groupCardNamesByRarity(baseSetSize = 0, cards = [], getGroup = rarityPlucker) {
  return cards.reduce((acc, card) => {
    if (baseSetSize >= card.number) {
      const group = getGroup(card);
      (acc[group] = acc[group] || []).push(card.name);
    }
    return acc;
  }, {});
}

const rarityPlucker = ({rarity}) => rarity;


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

module.exports = groupCardNamesByRarity;
