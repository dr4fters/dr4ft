const fs = require("fs");
const https = require("https");
const unzip = require("unzip");
const logger = require("../logger");
const updateDatabase = require("./update_database");

const mtgJsonURL = "https://mtgjson.com/json/AllSetFiles.zip";
const versionURL = "https://mtgjson.com/json/version.json";
const setsVersion = "data/version.json";

const isVersionNewer = (remoteVer, currentVer) => (
  Number(remoteVer.version.replace(/\./g, "")) > Number(currentVer.version.replace(/\./g, ""))
);

const isVersionUpToDate = () => (
  new Promise((resolve, reject) => {
    https.get(versionURL, res => {
      var json = "";
      res.on("data", chunk => { json += chunk; });
      res.on("end", function () {
        try {
          const remoteVersion = JSON.parse(json);

          if (fs.existsSync(setsVersion) && !isVersionNewer(remoteVersion, require("../../data/version.json"))) {
            resolve(true);
          }

          const version = JSON.stringify(remoteVersion);
          logger.info(`Found a new version ${version}`);
          fs.writeFileSync(setsVersion, version);
          resolve(false);
        } catch(err) {
          logger.error(`Error while fetching version to ${versionURL}: ${err.stack}`);
          reject();
        }
      });
    })
      .on("error", reject);
  })
);

const fetchZip = () => (
  new Promise((resolve, reject) => {
    https.get(mtgJsonURL, response => {
      logger.info("Updating AllSets.json");
      response
        .pipe(unzip.Parse())
        .on("entry", (entry) => {

          if (!fs.existsSync("data/sets")) {
            fs.mkdirSync("data/sets");
          }
          const file = fs.createWriteStream(`data/sets/${entry.path}`);
          entry.pipe(file)
            .on("finish", file.close);
        })
        .on("finish", resolve)
        .on("error", reject);
    });
  }));

const download = async () => {
  logger.info("Checking if AllSets.json is up to date");
  const isUpToDate = await isVersionUpToDate();
  if (!isUpToDate) {
    await fetchZip();
    logger.info("Fetch AllSets.json finished. Updating the cards and sets data");
    updateDatabase();
  } else {
    logger.info("AllSets.json is up to date");
  }
};

module.exports = {
  download
};

//Allow this script to be called directly from commandline.
if (!module.parent) {
  download();
}
