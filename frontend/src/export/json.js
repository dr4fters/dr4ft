import App from "../app";
import {ZONE_MAIN, ZONE_SIDEBOARD} from "../zones";

export default {
  name: "JSON",
  download: toJSON,
  downloadExtension: ".json",
  copy: toJSON
};
function toJSON() {
  return JSON.stringify({
    main: App.state.gameState.countCardsByName(ZONE_MAIN),
    side: App.state.gameState.countCardsByName(ZONE_SIDEBOARD)
  }, null, 2);
}
