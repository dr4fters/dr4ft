const parser = require('../backend/import/xml/parser');
const fs = require('fs');
console.log(process.argv);
const xml = fs.readFileSync(process.argv[2], 'utf8');
console.log(xml);
console.log(parser.parse(xml));
