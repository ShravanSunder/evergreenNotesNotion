/*
  Copied from https://git.io/JvPvp

	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
const { Template } = require("webpack");

function generateRuntime(runtimeTemplate, mainTemplate, source, hash) {
  const globalObject = mainTemplate.outputOptions.globalObject;
  const hotUpdateChunkFilename =
    mainTemplate.outputOptions.hotUpdateChunkFilename;
  const hotUpdateMainFilename =
    mainTemplate.outputOptions.hotUpdateMainFilename;
  const crossOriginLoading = mainTemplate.outputOptions.crossOriginLoading;
  const hotUpdateFunction = mainTemplate.outputOptions.hotUpdateFunction;
  const currentHotUpdateChunkFilename = mainTemplate.getAssetPath(
    JSON.stringify(hotUpdateChunkFilename),
    {
      hash: `" + ${mainTemplate.renderCurrentHashCode(hash)} + "`,
      hashWithLength: length =>
        `" + ${mainTemplate.renderCurrentHashCode(hash, length)} + "`,
      chunk: {
        id: '" + chunkId + "'
      }
    }
  );
  const currentHotUpdateMainFilename = mainTemplate.getAssetPath(
    JSON.stringify(hotUpdateMainFilename),
    {
      hash: `" + ${mainTemplate.renderCurrentHashCode(hash)} + "`,
      hashWithLength: length =>
        `" + ${mainTemplate.renderCurrentHashCode(hash, length)} + "`
    }
  );
  const runtimeSource = Template.getFunctionContent(runtimeTemplate)
    .replace(/\/\/\$semicolon/g, ";")
    .replace(/\$require\$/g, mainTemplate.requireFn)
    .replace(
      /\$crossOriginLoading\$/g,
      crossOriginLoading ? JSON.stringify(crossOriginLoading) : "null"
    )
    .replace(/\$hotMainFilename\$/g, currentHotUpdateMainFilename)
    .replace(/\$hotChunkFilename\$/g, currentHotUpdateChunkFilename)
    .replace(/\$hash\$/g, JSON.stringify(hash));
  return `${source}
function hotDisposeChunk(chunkId) {
delete installedChunks[chunkId];
}
var parentHotUpdateCallback = ${globalObject}[${JSON.stringify(
    hotUpdateFunction
  )}];
${globalObject}[${JSON.stringify(hotUpdateFunction)}] = ${runtimeSource}`;
}

module.exports = { generateRuntime };
