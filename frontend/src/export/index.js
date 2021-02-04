import cockatrice from "./cockatrice";
import mtgo from "./mtgo";

const toJSON = (filename, deck) => JSON.stringify(deck, null, 2);
const json = {
  name: "JSON",
  download: toJSON,
  downloadExtension: ".json",
  copy: toJSON
};

export default {
  cockatrice,
  mtgo,
  json: process.env.NODE_ENV === "development" ? json : null
  // NOTE this one is useful for extracting raw JSON of all the card info
  // This is particularly useful for populating test-cards.js
};
