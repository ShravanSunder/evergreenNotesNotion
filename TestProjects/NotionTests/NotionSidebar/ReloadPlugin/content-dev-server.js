/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/*globals window __webpack_hash__ */
if (module.hot) {
  var lastHash;
  var upToDate = function upToDate() {
    return lastHash.indexOf(__webpack_hash__) >= 0;
  };
  var reload = function reload(reloadWindow) {
    chrome.runtime.sendMessage(
      { __hmrReload__: true },
      () => reloadWindow && window.location.reload()
    );
  };
  var log = require("webpack/hot/log");
  var check = function check() {
    module.hot
      .check(true)
      .then(function(updatedModules) {
        if (!updatedModules) {
          log("warning", "[HMR] Cannot find update. Need to do a full reload!");
          log(
            "warning",
            "[HMR] (Probably because of restarting the webpack-dev-server)"
          );
          reload(true);
          return;
        }

        if (!upToDate()) {
          check();
        }

        require("webpack/hot/log-apply-result")(updatedModules, updatedModules);

        if (updatedModules && updatedModules.length) {
          reload(false);
        }

        if (upToDate()) {
          log("info", "[HMR] App is up to date.");
        }
      })
      .catch(function(err) {
        var status = module.hot.status();
        if (["abort", "fail"].indexOf(status) >= 0) {
          log(
            "warning",
            "[HMR] Cannot apply update. Need to do a full reload!"
          );
          log("warning", "[HMR] " + log.formatError(err));
          reload(true);
        } else {
          log("warning", "[HMR] Update failed: " + log.formatError(err));
        }
      });
  };
  var hotEmitter = require("webpack/hot/emitter");
  hotEmitter.on("webpackHotUpdate", function(currentHash) {
    lastHash = currentHash;
    if (!upToDate() && module.hot.status() === "idle") {
      log("info", "[HMR] Checking for updates on the server...");
      check();
    }
  });
  log("info", "[HMR] Waiting for update signal from WDS...");
} else {
  throw new Error("[HMR] Hot Module Replacement is disabled.");
}
