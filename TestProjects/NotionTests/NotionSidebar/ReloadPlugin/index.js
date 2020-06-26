const path = require("path"),
  fs = require("fs-extra"),
  ContentScriptHandler = require("./contentHandler");

class ReloadPlugin {
  constructor(opts) {
    this.opts = Object.assign(
      {
        manifest: "manifest.json",
        contentScripts: [],
        backgroundScript: null
      },
      opts || {}
    );

    this.contentScriptHandler = new ContentScriptHandler(
      this.opts.contentScripts,
      this.opts.backgroundScript
    );
  }

  apply(compiler) {
    const manifestPath = path.resolve(
      compiler.options.context,
      this.opts.manifest
    );

    this.contentScriptHandler.apply(compiler);
  }
}

module.exports = ReloadPlugin;
