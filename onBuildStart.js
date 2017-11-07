const fs = require('fs')
const allSets = require("./src/make/allsets")

fs.open("data/AllSets.json", "r", (err, fd) => {
  if (err) {
    console.log("No AllSets.json detected. Downloading the file...")
    allSets.download("http://mtgjson.com/json/AllSets.json", "data/AllSets.json", () => {
      console.log("Download of AllSets.json completed")
    })
  }
})

fs.createReadStream('config.client.js.default').pipe(fs.createWriteStream('config.client.js'));
fs.createReadStream('config.server.js.default').pipe(fs.createWriteStream('config.server.js'));
