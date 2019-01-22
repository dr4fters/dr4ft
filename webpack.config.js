const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  devtool: "cheap-eval-source-map",
  context: __dirname,
  entry: {
    app: "./public/src/init.js"
  },
  output: {
    path: path.join(__dirname, "./built"),
    filename: "[name]-[hash].js",
    publicPath: "/"
  },
  devServer: {
    contentBase: path.join(__dirname, "./built"),
    port: 9000,
    proxy: {
      "/": "http://127.0.0.1:1337",
    }
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html.tpl'
    }),
    new CopyWebpackPlugin([
      { from: 'public', ignore: ['*.tpl', 'src/**/*'] }
    ])
  ],
  resolve: {
    extensions: [".js", ".jsx", ".css", ".less"],
    alias: {
      Src: path.resolve(__dirname, "public/src"),
      NodePackages: path.resolve(__dirname, "node_modules")
    }
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
