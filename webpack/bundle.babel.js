/**
 * @prettier
 */

/** Dev Note: 
 * StatsWriterPlugin is disabled by default; uncomment to enable
 * when enabled, rebuilding the bundle will cause error for assetSizeLimit,
 * which we want to keep out of CI/CD
 * post build, cli command: npx webpack-bundle-analyzer <path>
 */ 

import configBuilder from "./_config-builder"
import { DuplicatesPlugin } from "inspectpack/plugin"
import { WebpackBundleSizeAnalyzerPlugin } from "webpack-bundle-size-analyzer"
// import path from "path"
// import { StatsWriterPlugin } from "webpack-stats-plugin"

const result = configBuilder(
  {
    minimize: true,
    mangle: true,
    sourcemaps: true,
    includeDependencies: true,
  },
  {
    entry: {
      "swagger-ui-bundle": [
        "./src/index.js",
      ],
    },
    output: {
      globalObject: "this",
      library: "SwaggerUIBundle",
    },
    plugins: [
      new DuplicatesPlugin({
        // emit compilation warning or error? (Default: `false`)
        emitErrors: false,
        // display full duplicates information? (Default: `false`)
        verbose: false,
      }),
      new WebpackBundleSizeAnalyzerPlugin("log.bundle-sizes.swagger-ui.txt"),
      // new StatsWriterPlugin({
      //   filename: path.join("log.bundle-stats.swagger-ui.json"),
      //   fields: null,
      // }),
    ]
  }
)

export default result
