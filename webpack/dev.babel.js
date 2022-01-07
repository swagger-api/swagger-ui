/**
 * @prettier
 */

import path from "path"

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
      filename: "[name].js",
      chunkFilename: "[id].js",
      library: {
        name: "[name]",
      },
      publicPath: "/",
    },

    devServer: {
      allowedHosts: "all", // for development within VMs
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
      },
      port: 3200,
      host: "0.0.0.0",
      hot: true,
      static: {
        directory: path.join(__dirname, "../", "dev-helpers"),
        publicPath: "/",
      },
      client: {
        logging: "info",
        progress: true,
      },
      devMiddleware: {},
    },
  },
)

// mix in the style config's plugins and loader rules

devConfig.plugins = [...devConfig.plugins, ...styleConfig.plugins]

devConfig.module.rules = [
  ...devConfig.module.rules,
  ...styleConfig.module.rules,
]

export default devConfig
