if (process.argv.length !== 4) {
  console.error("You need to supply XML to inject PICURLS into as 1st argument and URL to the *root* of images folder as the 2nd argument.");
  process.exit();
}

const parsethere = require('fast-xml-parser');
const parseback = require('fast-xml-parser').j2xParser;
const fs = require('fs');

const options_there = {
  ignoreAttributes: false,
  ignoreNameSapce: false,
  textNodeName: 'text'
};
const there = parsethere.parse(
  fs.readFileSync(process.argv[2], 'utf8').replace(/<!-->Tokens<\/-->/g, ''),
  options_there
);

const { cards } = there.cockatrice_carddatabase;
cards.card.forEach(c => {
  c.set['@_picurl'] = process.argv[3] + '/' + c.set.text + '/' + c.name + '.full.jpg';
});

const options_back = {
  format: true,
  ignoreAttributes: false,
  textNodeName: 'text'
}
const back = new parseback(options_back);

const xml = back.parse(there);
console.log(xml);
