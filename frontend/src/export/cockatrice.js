import {ZONE_MAIN, ZONE_SIDEBOARD} from "../zones";

// name = App.state.exportDeckFilename
// deck = {
//   [ZONE_MAIN]: App.state.gameState.get(ZONE_MAIN),
//   [ZONE_SIDEBOARD]: App.state.gameState.get(ZONE_SIDEBOARD)
// }
export default {
  name: "Cockatrice",
  download (name, deck) {
    return `\
<?xml version="1.0" encoding="UTF-8"?>
<cockatrice_deck version="1">
  <deckname>${name}</deckname>
  <zone name="main">
${
  collectByName(deck[ZONE_MAIN])
    .map(renderDownloadCard)
    .join("\n")
}
  </zone>
  <zone name="side">
${
  collectByName(deck[ZONE_SIDEBOARD])
    .map(renderDownloadCard)
    .join("\n")
}
  </zone>
</cockatrice_deck>`;
  },
  downloadExtension: ".cod",

  copy(name, deck) {
    return [
      ...collectByName(deck[ZONE_MAIN]).map(renderCopyCard),
      "Sideboard",
      ...collectByName(deck[ZONE_SIDEBOARD]).map(renderCopyCard),
    ].join("\n");
  }
};


function collectByName (cards, sideboard = false) {
  const collector = cards.reduce((acc, card) => {
    if (acc[card.name]) acc[card.name].count += 1;
    else acc[card.name] = { card, count: 1, sideboard };

    return acc;
  }, {});

  return Object.values(collector);
}

function renderDownloadCard ({ count, card }) {
  return `    <card number="${count}" name="${correctName(card)}"/>`;
}

function renderCopyCard ({ count, card }) {
  return `${count} ${correctName(card)}`;
}

function correctName (card) {
  switch (card.layout) {
  case "split":
  case "aftermath":
  case "adventure":
    return card.name;

  case "flip":
  case "transform":
  case "modal_dfc":
    return card.name.replace(/\s\/\/.*$/, "");

  default:
    return card.name;
  }
}
