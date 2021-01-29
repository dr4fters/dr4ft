import { ZONE_MAIN, ZONE_SIDEBOARD } from "../zones";

export default {
  name: "MTGO",
  download,
  downloadExtension: ".dek",
  copy
};

function download (name, deck) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Deck xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <NetDeckID>0</NetDeckID>
  <PreconstructedDeckID>0</PreconstructedDeckID>

${
  collectByName(deck[ZONE_MAIN])
    .map(renderDownloadCard)
    .join("\n")
}

${
  collectByName(deck[ZONE_SIDEBOARD], true)
    .map(renderDownloadCard)
    .join("\n")
}
</Deck>
`;
}

function copy (name, deck) {
  return [
    ...collectByName(deck[ZONE_MAIN]).map(renderCopyCard),
    "",
    "Sideboard",
    ...collectByName(deck[ZONE_SIDEBOARD]).map(renderCopyCard)
  ].join("\n");
}

function collectByName (cards, sideboard = false) {
  const collector = cards.reduce((acc, card) => {
    if (acc[card.name]) acc[card.name].count += 1;
    else acc[card.name] = { card, count: 1, sideboard };

    return acc;
  }, {});

  return Object.values(collector);
}
function renderCopyCard ({ card, count }) {
  return `${count} ${correctName(card)}`;
}

function renderDownloadCard ({ card, count, sideboard = false }) {
  if (!card.identifiers.mtgoId) {
    return `  <Cards Quantity="${count}" Sideboard="${sideboard}" Name="${correctName(card)}" Annotation="0" />`;
  }

  return `  <Cards CatID="${card.identifiers.mtgoId}" Quantity="${count}" Sideboard="${sideboard}" Name="${correctName(card)}" Annotation="0" />`;
}

function correctName (card) {
  switch (card.layout) {
  case "split":
  case "aftermath":
    return card.name.replace(/\s\/\/\s/g, "/");

  case "flip":
  case "transform":
  case "adventure":
  case "modal_dfc":
    return card.name.replace(/\s\/\/.*$/, "");

  default:
    return card.name;
  }
}
