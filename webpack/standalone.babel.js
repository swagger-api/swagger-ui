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
      library: "SwaggerUIStandalonePreset",
    },
  }
)

export default result
