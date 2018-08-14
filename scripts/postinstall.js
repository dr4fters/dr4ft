const fs = require("fs");
const os = require("os");
const allSets = require("../src/make/allsets");
const configFiles = ["config.client.js", "config.server.js"];

// Download Allsets.json
if(!fs.existsSync("data/AllSets.json")) {
  console.log("No AllSets.json detected. Downloading the file...");
  allSets.download("http://mtgjson.com/json/AllSets.json", "data/AllSets.json", () => {
    console.log("Download of AllSets.json completed");
  });
}

// Manage lib directory
const libDir = "public/lib";
if (!fs.existsSync(libDir)) {
  console.log("Populating public/lib...");
  fs.mkdirSync(libDir);
  fs.symlinkSync("../../node_modules/utils/utils.js", `${libDir}/utils.js`);
  fs.symlinkSync("../../node_modules/ee/ee.js", `${libDir}/ee.js`);
  fs.symlinkSync("../../node_modules/react/umd/react.production.min.js", `${libDir}/react.js`);
  fs.symlinkSync("../../node_modules/react-dom/umd/react-dom.production.min.js", `${libDir}/react-dom.js`);
  fs.createReadStream("node_modules/engine.io-client/engine.io.js").pipe(fs.createWriteStream(`${libDir}/engine.io.js`));
  fs.createReadStream("node_modules/normalize.css/normalize.css").pipe(fs.createWriteStream(`${libDir}/normalize.css`));
}

console.log("Installing configurations...");
configFiles.forEach(config => {
  if(!fs.existsSync(config)) {
    fs.createReadStream(`config/${config}.default`).pipe(fs.createWriteStream(config));
  }
});
