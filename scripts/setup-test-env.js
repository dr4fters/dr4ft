const fs = require("fs");
const configFiles = ["config.client.js", "config.server.js"];

configFiles.forEach(config => {
  if (!fs.existsSync(config)) {
    fs.copyFileSync(`config/${config}.default`, config);
  }
});
