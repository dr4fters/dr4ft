import App from "./app";

/**
 *
 * @param {string} setCode the setCode of the card
 * @param {(string|number)} number the number of the card
 * @return {string} the
 *
 * @example
 *  getScryfallImage("XLN", 1)
 *  getScryfallImage("XLN", "10a")
 *  getScryfallImage("XLN", "10b")
 */
const getScryfallImage = (setCode, number) => (
  `https://api.scryfall.com/cards/${setCode.toLowerCase()}/${number}?format=image&version=${App.state.cardSize}`
);

/**
 *
 * @description returns a cards image URL with the lang selected in the app
 * @param {string} setCode the setCode of the card
 * @param {(string|number)} number the number of the card
 * @return {string} the
 *
 * @example
 *  getScryfallImage("XLN", 1)
 *  getScryfallImage("XLN", "10a")
 *  getScryfallImage("XLN", "10b")
 */
const getScryfallImageWithLang = (setCode, number) => (
  `https://api.scryfall.com/cards/${setCode.toLowerCase()}/${number}/${App.state.cardLang}?format=image&version=${App.state.cardSize}`
);

/**
 * @description builds an event function that returns an image url
 * @param {Card} param0
 */
export const getFallbackSrc = ({setCode, number}) => {
  if (!setCode || !number) {
    return null;
  }

  const url = getScryfallImage(setCode, number);
  return ev => {
    if (url !== ev.target.src) {
      ev.target.src = url;
    }
  };
};
/**
 * @description builds an image url based on the card properties
 * @param {Card} card
 * @returns {string} the image url to display
 */
export const getCardSrc = ({scryfallId = "", url, setCode, number, isBack}) => (
  scryfallId !== ""
    ? `${getScryfallImageWithLang(setCode, number)}${isBack ? "&face=back" : ""}`
    : url
);
