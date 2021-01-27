/* NOTE think this export option is no longer needed? Magic Workstation doesn't seem to be maintained
 * Code left here in case that's wrong */

// import App from "../app";
// import {ZONE_MAIN, ZONE_SIDEBOARD} from "../zones";

// export default {
//   name: "Magic Workstation",
//   download() {
//     const arr = [];
//     [ZONE_MAIN, ZONE_SIDEBOARD].forEach(zoneName => {
//       const prefix = zoneName === ZONE_SIDEBOARD ? "SB: " : "";
//       const zone = App.state.gameState.countCardsBy(zoneName, ({setCode, name}) => `${setCode}|${name}`);
//       Object.entries(zone).forEach(([cardName, count]) => {
//         const [code, name] = cardName.split("|");
//         const sanitizedName = name.replace(" // ", "/");
//         arr.push(`${prefix}${count} [${code}] ${sanitizedName}`);
//       });
//     });
//     return arr.join("\n");
//   },
//   downloadExtension: '.mwdeck'
//   // copy ??
// }
