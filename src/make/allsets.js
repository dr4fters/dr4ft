const http = require("http");
const fs = require("fs");
const logger = require("../logger");

exports.download = function(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  http.get(url, function(response) {
    response.pipe(file);
    file.on("finish", function() {
      file.close(cb);  // close() is async, call cb after close completes.
      logger.info("Finished downloading Allsets.json");
    });
  }).on("error", function(err) {
    logger.error("On error occurred during the download of Allsets.json :" + err);
    // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
};
