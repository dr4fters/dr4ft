import swudb from "./swudb";

const toJSON = (filename, deck) => JSON.stringify(deck, null, 2);
const json = {
  name: "JSON",
  download: toJSON,
  downloadExtension: ".json",
  copy: toJSON
};

export default {
  swudb,
  json
};
