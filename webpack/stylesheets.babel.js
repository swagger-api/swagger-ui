/**
 * @prettier
 */

// NOTE: this config *does not* inherit from `_config-builder`.
// It is also used in the dev config.

import path from "path"
import MiniCssExtractPlugin from "mini-css-extract-plugin"

export default {
  mode: "production",

  entry: {
    "swagger-ui": "./src/style/main.scss",
  },

  module: {
    rules: [
      {
        test: [/\.(scss)(\?.*)?$/],
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: { sourceMap: true },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                sourceMap: true,
                plugins: [
                  require("cssnano")(),
                  "postcss-preset-env" // applies autoprefixer
                ],

              }
            },
          },
          {
            loader: "sass-loader",
            options: {
              // Prefer `dart-sass`
              implementation: require("sass"),
              sourceMap: true,
              sassOptions: {
                // `fibers` package is not compatible with Node.js v16.0.0 or later
                fiber: false, // disable auto attempt to load `fiber`
                // sourceMapContents: "true", // if sourceMap: true, sassOptions.sourceMapContents is ignored
              },
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
  ],

  devtool: "source-map",

  output: {
    path: path.join(__dirname, "../", "dist"),
    publicPath: "/dist",
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: "styles",
          test: /\.css$/,
          chunks: "all",
          enforce: true,
        },
      },
    },
  },
}
