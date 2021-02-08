import {ZONE_MAIN, ZONE_SIDEBOARD} from "../zones";

export default {
  name: "Text",
  download: text,
  downloadExtension: ".txt",
  copy: text
};

function text (name, deck) {
  return [
    ...deck[ZONE_MAIN].map(renderCopyCard),
    "Sideboard",
    ...deck[ZONE_SIDEBOARD].map(renderCopyCard),
  ].join("\n");
}

function renderCopyCard ({ count, card }) {
  return `${count} ${correctName(card)}`;
}

function correctName (card) {
  return card.name;
}
