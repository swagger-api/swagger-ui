/**
 * @prettier
 */

// NOTE: this config *does not* inherit from `_config-builder`.

import path from "path"
import ExtractTextPlugin from "extract-text-webpack-plugin"

export default {
  entry: {
    "swagger-ui": "./src/style/main.scss",
  },

  module: {
    rules: [
      {
        test: /\.(css)(\?.*)?$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader", "postcss-loader"],
        }),
      },
      {
        test: /\.(scss)(\?.*)?$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
              options: { minimize: true, sourceMap: true },
            },
            {
              loader: "postcss-loader",
              options: { sourceMap: true },
            },
            {
              loader: "sass-loader",
              options: {
                outputStyle: "expanded",
                sourceMap: true,
                sourceMapContents: "true",
              },
            },
          ],
        }),
      },
    ],
  },

  plugins: [
    new ExtractTextPlugin({
      filename: "[name].css",
      allChunks: true
    })
  ],

  devtool: "source-map",

  output: {
    path: path.join(__dirname, "../", "dist"),
    publicPath: "/dist",
    filename: "[name].css",
  },
}
