const path = require("path");
const webpack = require("webpack");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    polyfill: "@babel/polyfill",
    app: "./frontend/src/init.js"
  },
  output: {
    path: path.join(__dirname, "./built"),
    filename: "[name]-[fullhash].js",
    publicPath: "/"
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./frontend/index.html.tpl",
      cache: false
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "frontend",
          globOptions: {
            ignore: ["*.tpl", "src/**/*", "test/**/*", "**/*.spec.*"]
          }
        }
      ]
    }),
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
    minimize: false
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: [
          /node_modules/,
          /\.spec\.(js|mjs)$/
        ],
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
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          {
            loader: "resolve-url-loader",
            options: {
            }
          }, {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            }
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: "url-loader"
      }
    ]
  }
};
