/**
 * @prettier
 */

import configBuilder from "./_config-builder"

const result = configBuilder(
  {
    minimize: true,
    mangle: true,
    sourcemaps: true,
  },
  {
    entry: {
      "swagger-ui-standalone-preset": ["./src/standalone/index.js"],
    },

    output: {
      globalObject: "this",
      library: {
        name: "SwaggerUIStandalonePreset",
        export: "default",
      },
    },
  }
)

export default result
