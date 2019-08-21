var webpack = require('webpack');
const path = require('path');
 
module.exports = {
  entry: ['./js/index.js'],
  output: {
    path: path.resolve('./shared/static/js/'),
    filename: 'index_bundle.js'
  },
  module: {
    rules: [
      { test: /\m?js$/, exclude: /(node_modules|bower_components)/, loader: ["babel-loader"] },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      }
    ]
  },
  resolve: {
      extensions: ['.js', '.jsx', '.css']
  }
}
