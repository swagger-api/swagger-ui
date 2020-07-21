/**
 * @prettier
 */

import configBuilder from "./_config-builder"
import { DuplicatesPlugin } from "inspectpack/plugin"
import LodashModuleReplacementPlugin from "lodash-webpack-plugin"
import { WebpackBundleSizeAnalyzerPlugin } from "webpack-bundle-size-analyzer"

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
        "./src/polyfills.js", // TODO: remove?
        "./src/core/index.js",
      ],
    },
    output: {
      library: "SwaggerUIBundle",
    },
    plugins: [
      new DuplicatesPlugin({
        // emit compilation warning or error? (Default: `false`)
        emitErrors: false,
        // display full duplicates information? (Default: `false`)
        verbose: false,
      }),
      new LodashModuleReplacementPlugin(),
      new WebpackBundleSizeAnalyzerPlugin("log.bundle-sizes.swagger-ui.txt"),
    ]
  }
)

export default result
