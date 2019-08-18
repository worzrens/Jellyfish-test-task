var webpack = require('webpack');
const path = require('path');
 
module.exports = {
  entry: ['./project/static/js/index.js'],
  output: {
    path: path.resolve('./project/static/js/'),
    filename: 'index_bundle.js'
  },
  module: {
    rules: [
      { test: /\m?js$/, exclude: /(node_modules|bower_components)/, loader: ["babel-loader"] }
    ]
  },
  resolve: {
      extensions: ['.js', '.jsx', '.css']
  }
}
