/**
 * @prettier
 */

import path from "path"
import { HotModuleReplacementPlugin } from "webpack"
import configBuilder from "./_config-builder"
import styleConfig from "./stylesheets.babel"

const devConfig = configBuilder(
  {
    minimize: false,
    mangle: false,
    sourcemaps: true,
    includeDependencies: true,
  },
  {
    mode: "development",
    entry: {
      "swagger-ui-bundle": [
        "./src/polyfills.js", // TODO: remove?
        "./src/core/index.js",
      ],
      "swagger-ui-standalone-preset": [
        "./src/polyfills", // TODO: remove?
        "./src/standalone/index.js",
      ],
      "swagger-ui": "./src/style/main.scss",
    },

    performance: {
      hints: false
    },

    output: {
      library: "[name]",
      filename: "[name].js",
      chunkFilename: "[id].js",
    },

    devServer: {
      port: 3200,
      publicPath: "/",
      disableHostCheck: true, // for development within VMs
      stats: {
        colors: true,
      },
      hot: true,
      contentBase: path.join(__dirname, "../", "dev-helpers"),
      host: "0.0.0.0",
    },

    plugins: [new HotModuleReplacementPlugin()],
  }
)

// mix in the style config's plugins and loader rules

devConfig.plugins = [...devConfig.plugins, ...styleConfig.plugins]

devConfig.module.rules = [
  ...devConfig.module.rules,
  ...styleConfig.module.rules,
]

export default devConfig
