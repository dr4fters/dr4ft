import {ZONE_MAIN, ZONE_SIDEBOARD} from "../zones";

export default {
  name: "Cockatrice",
  download (name, deck) {
    return `\
<?xml version="1.0" encoding="UTF-8"?>
<cockatrice_deck version="1">
  <deckname>${name}</deckname>
  <zone name="main">
${
  deck[ZONE_MAIN]
    .map(renderDownloadCard)
    .join("\n")
}
  </zone>
  <zone name="side">
${
  deck[ZONE_SIDEBOARD]
    .map(renderDownloadCard)
    .join("\n")
}
  </zone>
</cockatrice_deck>`;
  },
  downloadExtension: ".cod",

  copy(name, deck) {
    return [
      ...deck[ZONE_MAIN].map(renderCopyCard),
      "Sideboard",
      ...deck[ZONE_SIDEBOARD].map(renderCopyCard),
    ].join("\n");
  }
};

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
  case "meld":
  case "modal_dfc":
    return card.name.replace(/\s\/\/.*$/, "");

  default:
    return card.name;
  }
}
