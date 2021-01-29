// import {countBy} from "lodash";
// import {ZONE_MAIN, ZONE_SIDEBOARD} from "../zones";

// export default function txt(deck) {
//   const arr = [];

//   [ZONE_MAIN, ZONE_SIDEBOARD].forEach(zoneName => {
//     if (zoneName === ZONE_SIDEBOARD) {
//       arr.push("Sideboard");
//     }
//     Object.entries(App.state.gameState.countCardsByName(zoneName))
//       .forEach(([name, count]) => {
//         // COCKATRICE ONLY TODO EXTRACT
//         // const frontSideName = name.replace(/\s*\/\/.*$/, "");

//         arr.push(`${count} ${name}`);
//       });
//   });
//   return arr.join("\n");
// }
