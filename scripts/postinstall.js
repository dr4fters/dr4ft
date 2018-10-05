const fs = require("fs");
const allSets = require("../src/make/allsets");
const configFiles = ["config.client.js", "config.server.js"];

// Delete old AllSets.json
if (fs.existsSync("data/AllSets.json")) {
  fs.unlinkSync("data/AllSets.json");
}

// Download Allsets.json
allSets.download("http://mtgjson.com/json/AllSets.json", "data/AllSets.json", () => {
  console.log("Download of AllSets.json finished");
});

console.log("Installing configurations...");
configFiles.forEach(config => {
  if (!fs.existsSync(config)) {
    fs.createReadStream(`config/${config}.default`).pipe(fs.createWriteStream(config));
  }
});
