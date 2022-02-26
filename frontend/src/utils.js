import { capitalize } from "lodash";

export function toTitleCase (sentence, separator=" ") {
  if (!sentence || typeof sentence !== "string") {
    return "";
  }

  const words = sentence.split(separator);
  const capitalized = words.map(capitalize);
  return capitalized.join(separator);
}
