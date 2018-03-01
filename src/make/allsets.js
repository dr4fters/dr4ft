/* eslint no-console: "off" */
const https = require("https");
const fs = require("fs");

exports.download = function(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  https.get(url, function(response) {
    response.pipe(file);
    file.on("finish", function() {
      file.close(cb);  // close() is async, call cb after close completes.
      console.log("Finished downloading Allsets.json");
    });
  }).on("error", function(err) {
    console.log("On error occurred during the download of Allsets.json :" + err);
    // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
};
