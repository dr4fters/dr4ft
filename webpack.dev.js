const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.join(__dirname, "./built"),
    port: 9000,
    proxy: {
      "/": "http://127.0.0.1:1337",
    }
  },
});
