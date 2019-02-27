const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
  entry: {
    app: "./public/src/init.js"
  },
  output: {
    path: path.join(__dirname, "./built"),
    filename: "[name]-[hash].js",
    publicPath: "/"
  },
  plugins: [
    new CleanWebpackPlugin(["built"]),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html.tpl"
    }),
    new CopyWebpackPlugin([
      { from: "public", ignore: ["*.tpl", "src/**/*"] }
    ])
  ],
  resolve: {
    extensions: [".js", ".jsx", ".css", ".less"],
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      maxSize: 200000
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          "babel-loader"
        ],
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader"
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: "url-loader"
      }
    ]
  }
};
