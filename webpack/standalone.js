/**
 * @prettier
 */

const configBuilder = require("./_config-builder")

const result = configBuilder(
  {
    minimize: true,
    mangle: true,
    sourcemaps: false,
  },
  {
    entry: {
      "swagger-ui-standalone-preset": [
        "./src/standalone/presets/standalone/index.js",
      ],
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

module.exports = result
