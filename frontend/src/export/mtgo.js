import { ZONE_MAIN, ZONE_SIDEBOARD } from "../zones";

export default {
  name: "MTGO",
  download,
  downloadExtension: ".txt"
  /* If mtgo later supports clipboard import, enable this: */
  // copy
};

function download (name, deck) {
  return [
    ...deck[ZONE_MAIN].map(renderDownloadCard),

    ...(deck[ZONE_SIDEBOARD].length ? ["", "Sideboard"] : []),

    ...deck[ZONE_SIDEBOARD].map(renderDownloadCard)
  ].join("\n");
}

function renderDownloadCard ({ card, count }) {
  return `${count} ${correctName(card)}`;
}

function correctName (card) {
  switch (card.layout) {
  case "split":
  case "aftermath":
    return card.name.replace(/\s\/\/\s/g, "/");

  case "flip":
  case "transform":
  case "meld":
  case "adventure":
  case "modal_dfc":
    return card.faceName || card.name.replace(/\s\/\/.*$/, "");

  default:
    return card.name;
  }
}

// NOTE: the following was abandoned because supporting .dek was hard
// and MTGO seems to handle a lot of tricky edge cases with .txt import

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
//     console.warn(`Exporting ${card.name} to .dek, it lacks an mtgoId, which may cause error on importing`);
//     return `  <Cards Quantity="${count}" Sideboard="${sideboard}" Name="${correctName(card)}" Annotation="0" />`;

//     // NOTE failing to have an mtgoId seems to mainly be because a set isn't present in MTGO.
//     // There are two cases so far known
//     // 1. it's a card that was never in mtgo - e.g. any unset card
//     //   - them import of any .dek containing this card will fail
//     //
//     // 2. it's a card that exists in mtgo, just not this printing - e.g. some promo Ancestral Recall
//     //   - exporting this card without a CatId leads MTGO to select another printing of the card
//     //   - the import of the .dek file works fine
//   }

//   return `  <Cards CatID="${card.identifiers.mtgoId}" Quantity="${count}" Sideboard="${sideboard}" Name="${correctName(card)}" Annotation="0" />`;
// }

