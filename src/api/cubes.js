const fs = require("fs");
const express = require("express");
const cubesRouter = express.Router();
const logger = require("../logger");

cubesRouter
  .get("/", (req, res) => {

    fs.readdir('src/cubes', function(err, fileNames) {
      if (err) {
        console.error(err)
        res.status(500).end()
      } else {
        let cubes = {}
        fileNames.forEach(name => {
          if (name.includes('.txt')) {
            const cube = fs.readFileSync(`src/cubes/${name}`)
            const key = name.slice(0, name.length-4)
            cubes[key] = cube.toString()
          }
        })
        res.status(200).send(cubes)
      }
    });

  });

module.exports = cubesRouter;
