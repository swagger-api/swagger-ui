/**
 * @prettier
 */

import configBuilder from "./_config-builder"
import path from "path"
import { DuplicatesPlugin } from "inspectpack/plugin"
import { WebpackBundleSizeAnalyzerPlugin } from "webpack-bundle-size-analyzer"
import { StatsWriterPlugin } from "webpack-stats-plugin"

const result = configBuilder(
  {
    minimize: true,
    mangle: true,
    sourcemaps: true,
    includeDependencies: false,
  },
  {
    entry: {
      "swagger-ui-es-bundle-core": [
        // "./src/polyfills.js", // TODO: remove?
        "./src/index.js",
      ],
    },
    output: {
      library: "SwaggerUIBundle",
      libraryTarget: "commonjs2",
    },
    plugins: [
      new DuplicatesPlugin({
        // emit compilation warning or error? (Default: `false`)
        emitErrors: false,
        // display full duplicates information? (Default: `false`)
        verbose: false,
      }),
      new WebpackBundleSizeAnalyzerPlugin("log.es-bundle-core-sizes.swagger-ui.txt"),
      // new StatsWriterPlugin({
      //   filename: path.join("log.es-bundle-core-stats.swagger-ui.json"),
      //   fields: null,
      // }),
    ]
  }
)

export default result
