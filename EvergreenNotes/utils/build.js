// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
let path = require('path');

var webpack = require('webpack'),
  config = require('../webpack.config');

delete config.chromeExtensionBoilerplate;

config.output = {
  path: path.resolve(__dirname, 'release'),
  filename: '[name].bundle.js',
};

config.plugins.push(new webpack.SourceMapDevToolPlugin({
  noSources: true,
  module: false,
  columns: false
}))

webpack(config, function (err) {
  if (err) throw err;
});