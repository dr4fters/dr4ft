import { ZONE_MAIN, ZONE_SIDEBOARD } from "../zones";

export default {
  name: "Arena",
  // download,
  // downloadExtension: "???"
  copy
};

// function download (name, deck) {
//   return `<?xml version="1.0" encoding="UTF-8"?>
// <Deck xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
//   <NetDeckID>0</NetDeckID>
//   <PreconstructedDeckID>0</PreconstructedDeckID>

// ${
//   deck[ZONE_MAIN]
//     .map(renderDownloadCard)
//     .filter(Boolean)
//     .join("\n")
// }

// ${
//   deck[ZONE_SIDEBOARD]
//     .map(renderDownloadCard)
//     .filter(Boolean)
//     .join("\n")
// }
// </Deck>
// `;
// }

// function renderDownloadCard ({ card, count, sideboard = false }) {
//   if (!card.identifiers.mtgoId) {
//     console.error(`Cannot export ${card.name} to .dek, it lacks an mtgoId`)
//     return null
//   }

//   return `  <Cards CatID="${card.identifiers.mtgoId}" Quantity="${count}" Sideboard="${sideboard}" Name="${correctName(card)}" Annotation="0" />`;
// }

function correctName (card) {
  switch (card.layout) {
  case "split":
  case "aftermath":
    return card.name.replace(/\s\/\/\s/g, " /// ");

  case "flip":
  case "transform":
  case "adventure":
  case "modal_dfc":
    return card.name.replace(/\s\/\/.*$/, "");

  default:
    return card.name;
  }
}

function copy (name, deck) {
  return [
    "Deck",
    ...deck[ZONE_MAIN].map(renderCopyCard),
    "",
    "Sideboard",
    ...deck[ZONE_SIDEBOARD].map(renderCopyCard)
  ].join("\n");
}
function renderCopyCard ({ card, count }) {
  return `${count} ${correctName(card)} (${card.setCode}) ${card.number}`;
}
