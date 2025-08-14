export default {
  name: "SWUDB",
  download (name, deck, leader,base) {
    return formatDeck(name, deck, leader, base);
  },
  downloadExtension: ".json",

  copy(name, deck, leader, base) {
    return JSON.stringify(formatDeck(name, deck, leader,base),null,2);
  }
};

function formatDeck(name, deck, leader, base) {
  const formmattedDeck = {
    metadata: {
      name,
      author: "SWUDr4ft"
    },
    leader: {
      id: leader,
      count: 1
    },
    base: {
      id: base,
      count: 1
    },
    deck: deck.main.map((card) => ({id: card.id, count: card.count})),
    sideboard: deck.side.map((card) => ({id: card.id, count: card.count}))
  };

  return formmattedDeck;
}
