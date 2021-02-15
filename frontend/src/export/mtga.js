import { ZONE_MAIN, ZONE_SIDEBOARD } from "../zones";

export default {
  name: "MTG Arena",
  /* If arena later offers file import, define these: */
  // download,
  // downloadExtension: "???"
  copy
};

function correctName (card) {
  switch (card.layout) {
  case "split":
  case "aftermath":
    return card.name.replace(/\s\/\/\s/g, " /// ");

  case "flip":
  case "transform":
  case "meld":
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
