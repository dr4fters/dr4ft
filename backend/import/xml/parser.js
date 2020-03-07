const parser = require("fast-xml-parser");

function parse(content) {
  const parsedContent = parser.parse(content, {ignoreAttributes: false, attributeNamePrefix: "", textNodeName: "text"});
  const root = parsedContent.cockatrice_carddatabase;
  if (!root) {
    throw new Error("root node <cockatrice_carddatabase> must be present");
  }

  const {sets, cards} = root;
  if (!sets || !cards) {
    throw new Error("node <sets> and <cards> must be present");
  }


  if (!sets.set) {
    throw new Error("node <sets> must be made of <set>");
  }

  if (typeof sets.set === "object" && !Array.isArray(sets.set)) {
    sets.set = [sets.set];
  }

  if (!cards.card) {
    throw new Error("node <cards> must have an array of <card>");
  }

  if (typeof cards.card === "object"  && !Array.isArray(cards.card)) {
    cards.card = [cards.card];
  }

  const jsonSets = sets.set.reduce((acc, s) => {
    const { name: code, longname: name = "", settype: type = "", releasedate: releaseDate = "" } = s;
    acc[code] = {
      code,
      name,
      type,
      releaseDate,
      cards: [],
      baseSetSize: 0
    };
    return acc;
  }, {});

  cards.card.forEach(c => {
    const { text: setCode, num = 0, picurl = "", picURL = "", rarity } = c.set;
    if (!["common", "basic", "uncommon", "rare", "mythic"].includes(rarity)) {
      throw new Error("<card> property <set> must contain an attribute rarity with one of common, basic, uncommon, rare or mythic");
    }
    if (jsonSets[setCode]) {
      const {
        cmc = 0,
        color = [],
        colors = [],
        layout = "normal",
        loyalty = "",
        manacost = 0,
        pt = "",
        side = "a",
        type = "" } = root.version === "3" ? c : c.prop;
      const [power, toughness] = pt.split("/");
      const fixedColors = getTrueColors(root.version, color, colors);
      const fixedType = getTrueType(type);
      const set = jsonSets[setCode];
      set.cards.push({
        name: c.name,
        manaCost: manacost,
        cmc,
        loyalty,
        text: c.text,
        type: fixedType,
        types: [fixedType],
        rarity,
        power: parseInt(power) || "",
        toughness: parseInt(toughness) || "",
        url: picurl || picURL,
        layout,
        number: parseInt(num),
        supertypes : [],
        side,
        isAlternative: false,
        colors: fixedColors
      });
      set.baseSetSize = set.baseSetSize + 1;
    }
  });
  return jsonSets;
}

const getTrueType = (type) => (
  type.split("-")[0].trim()
);

const getTrueColors = (version, colorv3, colorsv4) => (
  version === "3"
    ? Array.isArray(colorv3) ? colorv3 : [colorv3]
    : Array.isArray(colorsv4) ? colorsv4 : [colorsv4]
);

module.exports = {
  parse
};
