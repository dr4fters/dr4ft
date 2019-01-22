const https = require("https");
const fs = require("fs");
const logger = require("../logger");

const allSetsPath = "data/AllSets.json";
const mtgJsonURL = "https://mtgjson.com/json/AllSets.json";

const download = (onError) => {
  logger.info("Checking if AllSets.json is up to date");
  https.get(mtgJsonURL, response => {
    const lastMTGJsonUpdate = new Date(response.headers["last-modified"]).getTime();
    
    // Delete old AllSets.json
    if (fs.existsSync(allSetsPath)) {
      logger.info("Found a previous downloaded file. Checking if AllSets.json is up to date");
      const stats = fs.statSync(allSetsPath);
      const lastDownload = stats.mtime.getTime();

      if (lastDownload >= lastMTGJsonUpdate) {
        logger.info("AllSets.json is up to date");
        return;
      }
      logger.info("Found a new version of AllSets.json. Updating AllSets.json");
      fs.unlinkSync(allSetsPath);
    }
    logger.info("Downloading AllSets.json");
    const file = fs.createWriteStream(allSetsPath);
    response.pipe(file);
    file.on("finish", async () => {
      logger.info("Fetch AllSets.json finished. Updating the cards and sets data");
      const parseCards = require("./cards");
      await file.close(parseCards);  // close() is async, call cb after close completes.
      logger.info("Cards and sets updated");
    });
    
  }).on("error", err => { // Handle errors
    logger.error("Could not fetch the file AllSets.json. Please check your connection");
    fs.unlink(allSetsPath); // Delete the file async. (But we don't check the result)
    if(onError) {
      onError(err);
    }
  });
};

module.exports = {
  download
};

//Allow this script to be called directly from commandline.
if (!module.parent) {
  download();
}
