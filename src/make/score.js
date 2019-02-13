var fs = require("fs");
var {Cards} = require("../data");
var scores = JSON.parse(fs.readFileSync("./data/scores.json"));

for (var row of scores.rows) {
  var {key, value} = row;
  var lc = key.toLowerCase();
  // TODO scrub the db
  if (!(lc in Cards))
    continue;

  Cards[lc].score = value.sum / value.count;
}

fs.writeFileSync("data/cards.json", JSON.stringify(Cards, null, 2));
