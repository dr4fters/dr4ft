var https = require("https");
var fs = require("fs");

const allSetsPath = "data/AllSets.json";
const mtgJsonURL = "https://mtgjson.com/v4/json/AllSets.json";

const download = (onError) => {
  console.log("Checking if AllSets.json is up to date");
  https.get(mtgJsonURL, response => {
    const lastMTGJsonUpdate = new Date(response.headers["last-modified"]).getTime();
    
    // Delete old AllSets.json
    if (fs.existsSync(allSetsPath)) {
      console.log("Found a previous downloaded file. Checking if AllSets.json is up to date");
      const stats = fs.statSync(allSetsPath);
      const lastDownload = stats.mtime.getTime();

      if (lastDownload >= lastMTGJsonUpdate) {
        console.log("AllSets.json is up to date");
        return;
      }
      console.log("Found a new version of AllSets.json. Updating AllSets.json");
      fs.unlinkSync(allSetsPath);
    }
    console.log("Downloading AllSets.json");
    const file = fs.createWriteStream(allSetsPath);
    response.pipe(file);
    file.on("finish", () => {
      console.log("Fetch AllSets.json finished. Updating the cards and sets data");
      const parseCards = require("./cards");
      file.close(parseCards);  // close() is async, call cb after close completes.
      console.log("Cards and sets updated");
    });
    
  }).on("error", err => { // Handle errors
    console.log("Could not fetch the file AllSets.json. Please check your connection");
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