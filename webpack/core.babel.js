/**
 * @prettier
 */

import configBuilder from "./_config-builder"

const result = configBuilder(
  {
    minimize: true,
    mangle: true,
    sourcemaps: true,
    includeDependencies: false,
  },
  {
    entry: {
      "swagger-ui": [
        // "./src/polyfills.js", // TODO: remove?
        "./src/index.js",
      ],
    },

    output: {
      globalObject: "this",
      library: "SwaggerUICore",
    },
  }
)

export default result
