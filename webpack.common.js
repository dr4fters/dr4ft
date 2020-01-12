const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    polyfill: "@babel/polyfill",
    app: "./frontend/src/init.js"
  },
  output: {
    path: path.join(__dirname, "./built"),
    filename: "[name]-[hash].js",
    publicPath: "/"
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      template: "./frontend/index.html.tpl"
    }),
    new CopyWebpackPlugin([
      { from: "frontend", ignore: ["*.tpl", "src/**/*"] }
    ]),
    new webpack.DefinePlugin({
      BUILD_DATE: JSON.stringify(new Date().toISOString().slice(0, 10))
    })
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
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
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
