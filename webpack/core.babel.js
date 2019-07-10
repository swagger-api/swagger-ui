import path from "path"
import configBuilder from "./_config-builder"

const result = configBuilder({
  minimize: true,
  mangle: true,
  sourcemaps: true,
  includeDependencies: false,
}, {
  entry: {
    "swagger-ui": [
      "./src/core/index.js",
      "./src/polyfills.js" // TODO: remove?
    ]
  },

  output:  {
    library: "SwaggerUICore",
  }
})

export default result
