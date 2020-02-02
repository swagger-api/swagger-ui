/**
 * @prettier
 */

import configBuilder from "./_config-builder"
import { LicenseWebpackPlugin } from 'license-webpack-plugin'

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
      new LicenseWebpackPlugin()
    ]
  }
)

export default result
