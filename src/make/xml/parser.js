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
    acc[s.name] = {
      code: s.name,
      name: s.longname,
      type: s.settype,
      releaseDate: s.releasedate,
      cards: [],
      baseSetSize: 0
    };
    return acc;
  }, {});

  cards.card.forEach(c => {
    const { text: setCode, num, picurl, rarity } = c.set;
    if ([setCode, num, picurl, rarity].includes(undefined)) {
      throw new Error("<set> property of <card> must contain text, num, picurl and rarity");
    }
    if (jsonSets[setCode]) {
      const { cmc, colors, layout, loyalty, manacost, pt, side, type } = c.prop;
      if ([cmc, colors, layout, loyalty, manacost, pt, side, type].includes(undefined)) {
        throw new Error("<prop> property of <card> must contain cmc, colors, layout, loyalty, manacost, pt, side and type");
      }
      const [power, toughness] = pt.split("/");
      const set = jsonSets[setCode];
      set.cards.push({
        name: c.name,
        manaCost: manacost,
        cmc: cmc,
        loyalty: parseInt(loyalty),
        text: c.text,
        type: type.toLowerCase(),
        types: [type.toLowerCase()],
        rarity,
        power: parseInt(power) || "",
        toughness: parseInt(toughness) || "",
        url: picurl,
        layout,
        number: parseInt(num),
        supertypes : [],
        side,
        isAlternative: false,
        colors: colors.split("")
      });
      set.baseSetSize = set.baseSetSize + 1;
    }
  });

  return jsonSets;
}

module.exports = {
  parse
};
