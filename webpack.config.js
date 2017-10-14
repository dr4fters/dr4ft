const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'cheap-eval-source-map',
  // context: __dirname,
  entry: ['./public/src/init.js'],
  output: {
    path: path.join(__dirname, './public/lib'),
    filename: 'app.js',
    publicPath: '/'
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    port: 9000,
    proxy: {
      "/": "http://127.0.0.1:1337",
    }
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   template: './public/index.template',
    //   filename: '../index.html',
    //   inject: 'body'
    // })
    new webpack.NamedModulesPlugin()
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.less'],
    alias: {
      Lib: path.resolve(__dirname, "public/lib"),
      Src: path.resolve(__dirname, "public/src"),
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader'
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'url-loader'
      }
    ]
  }
};
