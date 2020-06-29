/**
 * @prettier
 */

import path from "path"

import configBuilder from "./_config-builder"

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
    resolve: {
      // these aliases make sure that we don't bundle same libraries twice
      // when the versions of these libraries diverge between swagger-js and swagger-ui
      alias: {
        "@babel/runtime-corejs2": path.resolve(__dirname, '..', 'node_modules/@babel/runtime-corejs2'),
        "js-yaml": path.resolve(__dirname, '..', 'node_modules/js-yaml')
      },
    },
  }
)

export default result
