function groupCardNamesByRarity(baseSetSize = 0, cards = []) {
  return cards.reduce((acc, {number = 0, rarity, name}) => {
    if (baseSetSize >= number) {
      (acc[rarity] = acc[rarity] || []).push(name);
    }
    return acc;
  }, {});
}

module.exports = groupCardNamesByRarity;
