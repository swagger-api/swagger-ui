/**
 * @prettier
 */

import path from "path"
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin"
import HtmlWebpackPlugin from "html-webpack-plugin"
import { HtmlWebpackSkipAssetsPlugin } from "html-webpack-skip-assets-plugin"

import configBuilder from "./_config-builder"
import styleConfig from "./stylesheets.babel"

const projectBasePath = path.join(__dirname, "../")
const isDevelopment = process.env.NODE_ENV !== "production"

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
      vendors: ["react-refresh/runtime"],
    },

    performance: {
      hints: false
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
      port: 3200,
      host: "0.0.0.0",
      hot: true,
      static: {
        directory: path.resolve(projectBasePath, "dev-helpers"),
        publicPath: "/",
      },
      client: {
        logging: "info",
        progress: true,
      },
    },

    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: [
            path.join(projectBasePath, "src"),
            path.join(projectBasePath, "node_modules", "object-assign-deep"),
          ],
          loader: "babel-loader",
          options: {
            retainLines: true,
            cacheDirectory: true,
            plugins: [isDevelopment && require.resolve("react-refresh/babel")].filter(Boolean),
          },
        },
        {
          test: /\.(txt|yaml)$/,
          type: "asset/source",
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          type: "asset/inline",
        },
      ],
    },

    plugins: [
      isDevelopment && new ReactRefreshWebpackPlugin({ library: "[name]" }),
      new HtmlWebpackPlugin({
        template: path.join(projectBasePath, "dev-helpers", "index.html"),
      }),
      new HtmlWebpackSkipAssetsPlugin({
        skipAssets: [/swagger-ui\.js/],
      }),
    ].filter(Boolean),

    optimization: {
      runtimeChunk: "single", // for multiple entry points using ReactRefreshWebpackPlugin
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
