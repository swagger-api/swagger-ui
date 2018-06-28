const path = require("path")

const rules = [
  { test: /\.(worker\.js)(\?.*)?$/,
    use: [
      {
        loader: "worker-loader",
        options: {
          inline: true
        }
      },
      { loader: "babel-loader?retainLines=true" }
    ]
  },
  { test: /\.(css)(\?.*)?$/,
    use: [
      "style-loader",
      "css-loader",
      "postcss-loader"
    ]
  },
  { test: /\.(scss)(\?.*)?$/,
    use: [
      "style-loader",
      "css-loader",
      {
        loader: "postcss-loader",
        options: { sourceMap: true }
      },
      { loader: "sass-loader",
        options: {
          outputStyle: "expanded",
          sourceMap: true,
          sourceMapContents: "true"
        }
      }
    ]
  }
]

module.exports = require("./make-webpack-config")(rules, {
  _special: {
    separateStylesheets: false,
  },
	devtool: "eval-source-map",
  entry: {
    "swagger-ui-bundle": [
      "./src/polyfills",
      "./src/core/index.js"
    ],
    "swagger-ui-standalone-preset": [
      "./src/style/main.scss",
      "./src/polyfills",
      "./src/standalone/index.js",
    ]
  },
  output: {
    pathinfo: true,
    filename: "[name].js",
    library: "[name]",
    libraryTarget: "umd",
    chunkFilename: "[id].js"
  },
  devServer: {
    port: 3200,
    publicPath: "/",
    noInfo: true,
    hot: true,
    disableHostCheck: true, // for development within VMs
    stats: {
      colors: true
    },
  },
})
