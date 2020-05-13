const capitalize = require("lodash/capitalize");

const toTitleCase = (sentence, separator=" ") => {
  if (!sentence || typeof sentence !== "string") {
    return "";
  }

  const words = sentence.split(separator);
  const capitalized = words.map(capitalize);
  return capitalized.join(separator);
};

module.exports = {
  toTitleCase
};
