import {countBy} from "lodash";

import {ZONE_MAIN, ZONE_SIDEBOARD} from "../zones";

// name = App.state.exportDeckFilename
// deck = {
//   [ZONE_MAIN]: App.state.gameState.get(ZONE_MAIN),
//   [ZONE_SIDEBOARD]: App.state.gameState.get(ZONE_SIDEBOARD)
// }
export default {
  name: "Cockatrice",
  download(name, deck) {
    return `\
<?xml version="1.0" encoding="UTF-8"?>
<cockatrice_deck version="1">
  <deckname>${name}</deckname>
  <zone name="main">
${codify(deck[ZONE_MAIN])}
  </zone>
  <zone name="side">
${codify(deck[ZONE_SIDEBOARD])}
  </zone>
</cockatrice_deck>`;
  },
  downloadExtension: ".cod",
  copy() {
    return txt();
    // TODO pass in options for:
    // - sideboard marker
    // - cardName modifier
  }
};
function codify(zone) {
  const arr = [];
  Object.entries(countBy(zone, "name")).forEach(([name, count]) => {
    arr.push(`    <card number="${count}" name="${name}"/>`);
  });
  return arr.join("\n");
}
