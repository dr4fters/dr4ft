const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'cheap-eval-source-map',
  context: __dirname,
  entry: {
    app: './public/src/init.js',
    react: ['react', 'react-dom']
  },
  output: {
    path: path.join(__dirname, './public/lib'),
    filename: '[name].js',
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
    new webpack.NamedModulesPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.less'],
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
