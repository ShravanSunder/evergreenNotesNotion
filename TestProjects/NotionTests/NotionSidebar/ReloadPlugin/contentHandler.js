const { generateRuntime } = require("./utils");

class ContentScriptHandler {
  constructor(contentScripts, backgroundScript) {
    this.contentScripts = contentScripts;
    this.backgroundScript = backgroundScript;
  }

  apply(compiler) {
    compiler.hooks.compile.tap("ReloadPlugin", () => {
      let needReloadServer = false;
      for (const content of this.contentScripts) {
        for (const [index, entry] of []
          .concat(compiler.options.entry[content])
          .entries()) {
          if (entry === require.resolve("webpack/hot/dev-server")) {
            // For hot updates that are unaccepted or failed, use our own
            // dev-server script that 1) sends a message to the background
            // script to reload the extension and 2) reloads the page

            compiler.options.entry[content][index] = require.resolve(
              "./content-dev-server"
            );
            needReloadServer = true;
          }
        }
      }

      if (needReloadServer) {
        const reloaderPath = require.resolve("./background-reloader");
        if (this.backgroundScript) {
          compiler.options.entry[this.backgroundScript] = [reloaderPath].concat(
            compiler.options.entry[this.backgroundScript]
          );
        } else {
          compiler.options.entry["background"] = reloaderPath;
        }

        compiler.hooks.entryOption.call(
          compiler.options.context,
          compiler.options.entry
        );
      }
    });

    compiler.hooks.thisCompilation.tap("ReloadPlugin", compilation => {
      // Patch the HMR template with our own that uses fetch + eval instead of JSONP
      compilation.mainTemplate.hooks.hotBootstrap.intercept({
        register: tap => ({
          ...tap,
          name: "ReloadPlugin",
          fn: (source, chunk, hash) => {
            if (this.contentScripts.includes(chunk.name)) {
              return generateRuntime(
                require("./content.runtime"),
                compilation.mainTemplate,
                source,
                hash
              );
            }
            return tap.fn(source, chunk, hash);
          }
        })
      });
    });
  }
}

module.exports = ContentScriptHandler;
