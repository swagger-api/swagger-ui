/**
 * @prettier
 */

const path = require("path")

const configBuilder = require("./_config-builder")
const styleConfig = require("./stylesheets")

// Pretty much the same as devConfig, but with changes to port and static.directory
const devE2eConfig = configBuilder(
  {
    minimize: false,
    mangle: false,
    sourcemaps: true,
    includeDependencies: true,
  },
  {
    mode: "development",
    entry: {
      "swagger-ui-bundle": ["./src/core/index.js"],
      "swagger-ui-standalone-preset": [
        "./src/standalone/presets/standalone/index.js",
      ],
      "swagger-ui": "./src/style/main.scss",
    },

    performance: {
      hints: false,
    },

    output: {
      filename: "[name].js",
      chunkFilename: "[id].js",
      library: {
        name: "[name]",
        export: "default",
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
      port: 3230,
      host: "0.0.0.0",
      hot: true,
      static: {
        directory: path.join(__dirname, "../", "test", "e2e-cypress", "static"),
        publicPath: "/",
      },
      client: {
        logging: "info",
        progress: true,
        overlay: false,
      },
      devMiddleware: {},
    },
  }
)

// mix in the style config's plugins and loader rules

devE2eConfig.plugins = [...devE2eConfig.plugins, ...styleConfig.plugins]

devE2eConfig.module.rules = [
  ...devE2eConfig.module.rules,
  ...styleConfig.module.rules,
]

module.exports = devE2eConfig
