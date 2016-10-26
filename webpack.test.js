const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  devtool: 'inline-source-map',
  debug: true,

  target: 'node', // in order to ignore built-in modules like path, fs, etc.
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder

  resolve: {
    alias: {
      'taller-postgres': path.resolve('./src/index.js')
    },

    modulesDirectories: [
      path.resolve('./src'),
      path.resolve('./node_modules')
    ],

    root: [
      path.resolve('./test')
    ]
  },

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader', include: __dirname }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('test')
      }
    })
  ]
}
