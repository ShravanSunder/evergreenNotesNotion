// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
let path = require('path');
console.log(__dirname);

var webpack = require('webpack'),
  config = require('../webpack.config');

//delete config.chromeExtensionBoilerplate;

config.plugins.push(new webpack.SourceMapDevToolPlugin({
  noSources: true,
  module: false,
  columns: false
}))

webpack(config, function (err) {
  if (err) throw err;
});