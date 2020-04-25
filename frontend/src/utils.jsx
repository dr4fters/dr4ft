//TODO: check if lodash can do it
export const toTitleCase = (string="", separator=" ") =>
  string.split(separator)
    .reduce((result, word) => `${result} ${word.charAt(0).toUpperCase()+word.slice(1).toLowerCase()}`, "");
