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
import nodeExternals from "webpack-node-externals"
// import { StatsWriterPlugin } from "webpack-stats-plugin"

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
        "./src/index.js",
      ],
    },
    experiments: {
      outputModule: true,
    },
    output: {
      module: true,
      libraryTarget: "module",
      library: {
        type: "module",
      },
      environment: {
        module: true,
      },
    },
    externalsType: "module",
    externals: [
      {
        esprima: "esprima",
      },
      nodeExternals({
        importType: (moduleName) => {
          return `module ${moduleName}`
      }})
    ],
    plugins: [
      new DuplicatesPlugin({
        emitErrors: false,
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
