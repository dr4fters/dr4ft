const express = require("express");
const setsRouter = express.Router();
const makeCards = require("../make/cards");

setsRouter
  .post("/upload", (req, res, next) => {
    let file = req.files.file;
    const content = file.data.toString();
    
    var json;
    try {
      json = JSON.parse(content);
    } catch(err) {
      res.status(400).json(`the json submitted is not valid: ${err}`);
      return;
    }

    console.log(json);

    const { Sets, Cards } = makeCards(json);
    
    console.log(Sets);

    // imageFile.mv(`/tmp/${req.files.file.name}`, function(err) {
    //   if (err) {
    //     return res.status(500).send(err);
    //   }
      
      res.json({test: "ok"});
    // });
  });

module.exports = setsRouter;