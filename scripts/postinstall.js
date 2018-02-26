const fs = require("fs");
const allSets = require("../src/make/allsets");
const configFiles = ["config.client.js", "config.server.js"];
const logger = require("../src/logger");
const serverConfig = require("../config.server");

// Create the log dir
if(!fs.existsSync(serverConfig.LOGDIR)) {
  fs.mkdirSync(serverConfig.LOGDIR);
}

// Download Allsets.json
if(!fs.existsSync("data/AllSets.json")) {
  logger.info("No AllSets.json detected. Downloading the file...");
  allSets.download("https://mtgjson.com/json/AllSets.json", "data/AllSets.json", () => {
    logger.info("Download of AllSets.json completed");
  });
}

// Manage lib directory
const libDir = "public/lib";
if (!fs.existsSync(libDir)) {
  logger.info("Populating public/lib...");
  fs.mkdirSync(libDir);
  fs.symlinkSync("../../node_modules/utils/utils.js", `${libDir}/utils.js`);
  fs.symlinkSync("../../node_modules/ee/ee.js", `${libDir}/ee.js`);
  fs.createReadStream("node_modules/engine.io-client/engine.io.js").pipe(fs.createWriteStream(`${libDir}/engine.io.js`));
  fs.createReadStream("node_modules/normalize.css/normalize.css").pipe(fs.createWriteStream(`${libDir}/normalize.css`));
}

logger.info("Installing configurations...");
configFiles.forEach(config => {
  if(!fs.existsSync(config)) {
    fs.createReadStream(`config/${config}.default`).pipe(fs.createWriteStream(config));
  }
});
logger.info("Finished installing configurations...");
