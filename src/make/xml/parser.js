const libxml = require("libxmljs");
const fs = require("fs");
const path = require("path");

const schema = fs.readFileSync(path.join(__dirname, "cards.xsd"));
const xsdDoc = libxml.parseXml(schema);

function parse(content) {
  const parsedContent = libxml.parseXml(content);
  parsedContent.validate(xsdDoc);
  if (parsedContent.validationErrors.length) {
    throw new Error(parsedContent.validationErrors);
  }
  const {cockatrice_carddatabase} = parsedContent;
  const {sets, cards} = cockatrice_carddatabase;
  const jsonSets = {};
  sets.set.forEach((s) => {
    jsonSets[s.name] = {
      code: s.name,
      name: s.longname,
      type: s.settype,
      releaseDate: s.releasedate,
      cards: []
    };
  });

  cards.card.forEach(c => {
    if (jsonSets[c.set]) {
      // const [power, toughness] = c.pt.split("/");
      // jsonSets[c.set].push({
      //   name: c.name,
      //   manaCost: c.manacost,
      //   cmc: c.cmc,
      //   loyalty: parseInt(c.loyalty),
      //   text: c.text,
      //   type: c.type,
      //   types: c.types,
      //   rarity: c.rarity,
      //   layout: c.layout,
      //   number: parseInt(c.number),
      //   supertypes : [],
      //   scryfallId, side, isAlternative, colors: c.color.split(""),
      // });
    }
  });
  return;
}


module.exports = {
  parse
};
