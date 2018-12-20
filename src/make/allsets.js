var https = require("https");
var fs = require("fs");

const allSetsPath = "data/AllSets.json";
const mtgJsonURL = "https://mtgjson.com/json/AllSets.json";

exports.download = (onFileDownloaded, onError) => {
  https.get(mtgJsonURL, response => {
    const lastMTGJsonUpdate = new Date(response.headers["last-modified"]).getTime();

    // Delete old AllSets.json
    if (fs.existsSync(allSetsPath)) {
      const stats = fs.statSync(allSetsPath)
      const lastDownload = stats.mtime.getTime();

      if(lastDownload >= lastMTGJsonUpdate) {
        console.log("AllSets.json is up to date")
        return;
      }
      fs.unlinkSync(allSetsPath);
    }
    const file = fs.createWriteStream(allSetsPath);
    response.pipe(file);
    file.on("finish", () => {
      file.close(onFileDownloaded);  // close() is async, call cb after close completes.
    });

  }).on("error", err => { // Handle errors
    fs.unlink(allSetsPath); // Delete the file async. (But we don't check the result)
    if(onError) {
      onError(err)
    }
  });
};
