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
      { loader: "babel-loader" }
    ]
  },
  { test: /\.(jsx)(\?.*)?$/,
    use: [
      { loader: "react-hot-loader" }, 
      { loader: "babel-loader" }
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
	devtool: "eval",
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
    contentBase: path.join(__dirname, "dev-helpers"),
    publicPath: "/",
    noInfo: true,
    hot: true,
    stats: {
      colors: true
    },
  },
})
