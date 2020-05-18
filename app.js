const http = require("http");
const schedule = require("node-schedule");
const eio = require("engine.io");
const express = require("express");
const helmet = require("helmet");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const {spawn} = require("child_process");
const logger = require("./backend/logger");
const router = require("./backend/router");
const apiRouter = require("./backend/api/");
const {app: config, version} = require("./config");
const app = express();
require("./backend/data-watch");


//Middlewares
app.use(helmet());
app.use(bodyParser.json()); // for parsing application/json
app.use(cors());
app.use(fileUpload());

//routing
app.use(express.static("built"));
app.use("/api", apiRouter);

// Download Allsets.json if there's a new one and make the card DB
spawn("node", ["scripts/download_allsets.js"], { stdio: "inherit" });
spawn("node", ["scripts/download_booster_rules.js"], { stdio: "inherit" });

// Schedule check of a new sets and new boosterRules every hour
schedule.scheduleJob("0 * * * *", () => {
  spawn("node", ["scripts/download_allsets.js"], { stdio: "inherit" });
  spawn("node", ["scripts/download_booster_rules.js"], { stdio: "inherit" });
});

// Create server
const server = http.createServer(app);
const io = eio(server);
io.on("connection", router);

server.listen(config.PORT);
logger.info(`Started up on port ${config.PORT} with version ${version}`);

