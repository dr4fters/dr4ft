/*Running Make against this file will allow you to add custom sets
which have the correct JSON formatting to your card and set databases
the formats are as follows
CURRENT FORMAT (previous versions of the program used a different format)
The set with code "ABC" named "Abacus" and containing some misc cards would look like this
{"ABC":
{
"cards": [
{
"cid":["W"],
"cmc":1,
"colors":["W"],
"cost":"W",
"name":"Aaaaaa",
"num":"1/264",
"pt":"2/1",
"rarity":"uncommon",
"text":"",
"type":"Creature — Hound Soldier",
"url":"http://example.com/aaaaaa.jpg"
},
{
"cid":["W"],
"cmc":4,
"colors":["W"],
"cost":"2WW",
"name":"Bbbbbb",
"num":"2/264",
"pt":"3/3",
"rarity":"mythic rare",
"text":"Lifelink",
"type":"Legendary Enchantment Creature — God",
"url":"http://example.com/bbbbbb.jpg"
}]}}
*/

const fs = require("fs");
const logger = require("../logger");

const Cards = require("../../data/cards");
const Sets = require("../../data/sets");
const custom = require("../../data/custom");

if (custom.cards) {
  logger.info("Making custom set (old format) " + custom.code);
  makeCustomSet(custom);
}/*  */
else {
  for (var customset in custom) {
    logger.info("Making custom set " + customset);
    makeCustomSet(custom[customset]);
  }
}

function makeCustomSet(customset) {
  var code = customset.code;
  var packsize = customset.packsize || 10;
  if (Sets[code]) {
    logger.info("already processed, exiting");
    return;
  }
  const set = Sets[code] = {
    common: [],
    uncommon: [],
    rare: [],
    mythic: [],
    size: packsize
  };
  makeCustomCards(customset.cards, set, code);
}

function makeCustomCards(cards, set, code) {
  const COLORS = {
    W: "white",
    U: "blue",
    B: "black",
    R: "red",
    G: "green"
  };

  cards.forEach(rawCard => {
    const rarity = rawCard.rarity.split(" ")[0].toLowerCase();
    if (rarity === "basic")
      return;

    const {name} = rawCard;
    const lc = name.toLowerCase();
    set[rarity].push(lc);

    const sets = {[code]: { rarity, url: rawCard.url }};
    if (Cards[lc])
      return Cards[lc].sets[code] = sets[code];

    const {cid} = rawCard;
    const color
      = cid.length === 1 ? COLORS[cid[0]]
        : !cid.length ? "colorless"
          : "multicolor";

    Cards[lc] = {
      cmc: rawCard.cmc,
      color,
      name,
      type: rawCard.type.split(" ")[0],
      sets
    };
  });
}

fs.writeFileSync("data/cards.json", JSON.stringify(Cards, null, 2));
fs.writeFileSync("data/sets.json", JSON.stringify(Sets, null, 2));
