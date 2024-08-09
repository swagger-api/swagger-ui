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
      "swagger-ui-optional-plugins": [
        "./src/optional-plugins/index.js",
      ],
    },

    output: {
      globalObject: "this",
      library: {
        name: "SwaggerOptionalPlugins",
        export: "default",
      },
    },
  }
)

module.exports = result
