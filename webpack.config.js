const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: "cheap-eval-source-map",
  context: __dirname,
  entry: {
    app: "./public/src/init.js"
  },
  output: {
    path: path.join(__dirname, "./public/lib"),
    filename: "[name]-[hash].js",
    publicPath: "lib"
  },
  devServer: {
    contentBase: path.join(__dirname, "public"),
    port: 9000,
    proxy: {
      "/": "http://127.0.0.1:1337",
    }
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html.tpl',
      filename: __dirname + '/public/index.html'
    })
  ],
  resolve: {
    extensions: [".js", ".jsx", ".css", ".less"],
    alias: {
      Lib: path.resolve(__dirname, "public/lib"),
      Src: path.resolve(__dirname, "public/src"),
    }
  },
  module: {
    noParse:/engine.io/,
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
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM"
  }
};
