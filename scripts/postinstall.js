const fs = require("fs");
const allSets = require("../src/make/allsets");
const configFiles = ["config.client.js", "config.server.js"];

// Download Allsets.json
allSets.download();

console.log("Installing configurations...");
configFiles.forEach(config => {
  if (!fs.existsSync(config)) {
    fs.createReadStream(`config/${config}.default`).pipe(fs.createWriteStream(config));
  }
});
