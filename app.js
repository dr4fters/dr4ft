require("log-timestamp");
const logger = require("./src/logger");
const config = require("./config.server");
const http = require("http");
const eio = require("engine.io");
const router = require("./src/router");
const apiRouter = require("./src/api/");
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const schedule = require("node-schedule");
const app = express();

const allSets = require("./src/make/allsets");

// Download Allsets.json if there's a new one and make the card DB
allSets.download();
schedule.scheduleJob("0 * * * *", () => {
  allSets.download();
} );

const server = http.createServer(app);
const io = eio(server);
io.on("connection", router);

//Middlewares
app.use(helmet());
app.use(bodyParser.json()); // for parsing application/json

//routing
app.use(express.static("built"));
app.use("/api", apiRouter);

server.listen(config.PORT);
logger.info(`Started up on port ${config.PORT} with version ${config.VERSION}`);

