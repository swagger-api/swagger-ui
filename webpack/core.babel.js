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
        "./src/index.js",
      ],
    },

    output: {
      globalObject: "this",
      library: {
        name: "SwaggerUICore",
        export: "default",
      },
    },
  }
)

export default result
