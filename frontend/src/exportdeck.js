import App from "./app";
import {ZONE_MAIN, ZONE_SIDEBOARD} from "./zones";
import {countBy} from "lodash";

const cockatrice = {
  name: "Cockatrice",
  download() {
    return `\
<?xml version="1.0" encoding="UTF-8"?>
<cockatrice_deck version="1">
  <deckname>${App.state.exportDeckFilename}</deckname>
  <zone name="main">
${codify(App.state.gameState.get(ZONE_MAIN))}
  </zone>
  <zone name="side">
${codify(App.state.gameState.get(ZONE_SIDEBOARD))}
  </zone>
</cockatrice_deck>`;
  },
  downloadExtension: '.cod',
  copy() {
    return txt()
    // TODO pass in options for:
    // - sideboard marker
    // - cardName modifier
  }
}
function codify(zone) {
  const arr = [];
  Object.entries(countBy(zone, "name")).forEach(([name, count]) => {
    arr.push(`    <card number="${count}" name="${name}"/>`);
  });
  return arr.join("\n");
}

const magicWorkstation = {
  name: "Magic Workstation",
  download() {
    const arr = [];
    [ZONE_MAIN, ZONE_SIDEBOARD].forEach(zoneName => {
      const prefix = zoneName === ZONE_SIDEBOARD ? "SB: " : "";
      const zone = App.state.gameState.countCardsBy(zoneName, ({setCode, name}) => `${setCode}|${name}`);
      Object.entries(zone).forEach(([cardName, count]) => {
        const [code, name] = cardName.split("|");
        const sanitizedName = name.replace(" // ", "/");
        arr.push(`${prefix}${count} [${code}] ${sanitizedName}`);
      });
    });
    return arr.join("\n");
  },
  downloadExtension: '.mwdeck'
  // copy ??
}

const mtgo = {
  name: "MTGO",
  // download
  // downloadExtension
  copy() {
    return txt()
    // TODO different options
  }
}

const json = {
  name: "JSON",
  download: toJSON,
  downloadExtension: '.json',
  copy: toJSON
}
function toJSON() {
  return JSON.stringify({
    main: App.state.gameState.countCardsByName(ZONE_MAIN),
    side: App.state.gameState.countCardsByName(ZONE_SIDEBOARD)
  }, null, 2);
}

function txt() {
  const arr = [];
  [ZONE_MAIN, ZONE_SIDEBOARD].forEach(zoneName => {
    if (zoneName === ZONE_SIDEBOARD) {
      arr.push("Sideboard");
    }
    Object.entries(App.state.gameState.countCardsByName(zoneName))
      .forEach(([name, count]) => {
        // COCKATRICE ONLY TODO EXTRACT
        // const frontSideName = name.replace(/\s*\/\/.*$/, "");

        arr.push(`${count} ${name}`);
      });
  });
  return arr.join("\n");
}

export default {
  cockatrice,
  mtgo,
  arena: {
    name: "Arena"
  },
  magicWorkstation,
  txt: {
    name: "txt"
  }
  // json
}
