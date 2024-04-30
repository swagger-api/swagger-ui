/**
 * @prettier
 */

/** Dev Note:
 * StatsWriterPlugin is disabled by default; uncomment to enable
 * when enabled, rebuilding the bundle will cause error for assetSizeLimit,
 * which we want to keep out of CI/CD
 * post build, cli command: npx webpack-bundle-analyzer <path>
 */

const { DuplicatesPlugin } = require("inspectpack/plugin")
const {
  WebpackBundleSizeAnalyzerPlugin,
} = require("webpack-bundle-size-analyzer")
const configBuilder = require("./_config-builder")

// import path from "path"
// import { StatsWriterPlugin } from "webpack-stats-plugin"

const result = configBuilder(
  {
    minimize: true,
    mangle: true,
    sourcemaps: false,
    includeDependencies: true,
  },
  {
    entry: {
      "swagger-ui-bundle": ["./src/index.js"],
    },
    output: {
      globalObject: "this",
      library: {
        name: "SwaggerUIBundle",
        export: "default",
      },
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
    ],
  }
)

module.exports = result
