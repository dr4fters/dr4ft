const capitalize = (word) => {
  if (!word || typeof word !== "string") {
    return "";
  }
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

const toTitleCase = (sentence, separator=" ") => {
  if (!sentence || typeof sentence !== "string") {
    return "";
  }

  const words = sentence.split(separator);
  const capitalized = words.map(capitalize);
  return capitalized.join(separator);
};

module.exports = {
  capitalize,
  toTitleCase
};
