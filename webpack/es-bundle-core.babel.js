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

const minimize = true
const sourcemaps = true

const result = configBuilder(
  {
    minimize,
    mangle: true,
    sourcemaps,
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
    devtool: sourcemaps && minimize ? "source-map" : false,
    externalsType: "module",
    externals: [
      {
        esprima: "esprima",
      },
      nodeExternals({
        allowlist: [
          /object\/define-property/, // @babel/runtime-corejs3 import which makes fragment work with Jest
          "deep-extend", // uses Buffer as global symbol
          "randombytes", // uses require('safe-buffer')
          "sha.js", // uses require('safe-buffer')
          "xml", // uses require('stream')
          /process\/browser/, // is injected via ProvidePlugin
          /readable-stream/, // byproduct of buffer ProvidePlugin injection
          "util-deprecate", // dependency of readable-stream
          "inherits", // dependency of readable-stream
          "events", // dependency of readable-stream
          /safe-buffer/, // contained in resolve.alias
          /string_decoder/, // byproduct of buffer ProvidePlugin injection
          "buffer", // buffer is injected via ProvidePlugin
        ],
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
