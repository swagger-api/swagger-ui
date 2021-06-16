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
        "./src/core/index.js",
      ],
      "swagger-ui-standalone-preset": [
        "./src/standalone/index.js",
      ],
      "swagger-ui": "./src/style/main.scss",
    },

    performance: {
      hints: false
    },

    output: {
      // globalObject: "this",
      library: {
        name: "[name]",
        // type: "umd",
      },
      filename: "[name].js",
      chunkFilename: "[id].js",
    },

    devServer: {
      port: 3200,
      host: "0.0.0.0",
      // begin section: webpack-dev-server@3, to remove in webpack-dev-server@4
      disableHostCheck: true, // for development within VMs; @next => firewall
      stats: {
        colors: true,
      }, // @next, use stats option from webpack.config.js
      hot: true, // @next, true by default
      contentBase: path.join(__dirname, "../", "dev-helpers"), // @next: static: {}
      publicPath: "/", // @next: static: {}
      //  begin section: webpack-dev-server@4
      // firewall: false, // for development within VMs
      // static: [{
      //   directory: path.join(__dirname, "../", "dev-helpers"),
      //   publicPath: "/",
      // }],
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
