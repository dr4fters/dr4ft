export default {
  name: "JSON",
  download: toJSON,
  downloadExtension: ".json",
  copy: toJSON
};
function toJSON(filename, deck) {
  return JSON.stringify(deck, null, 2);
}
