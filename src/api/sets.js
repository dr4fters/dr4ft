const express = require("express");
const setsRouter = express.Router();

setsRouter
  .post("/upload", (req, res, next) => {
    console.log(req.files.file);
    let imageFile = req.files.file;
      
    imageFile.mv(`/tmp/${req.files.file.name}`, function(err) {
      if (err) {
        return res.status(500).send(err);
      }
      
      res.json({test: "ok"});
    });
  });

module.exports = setsRouter;