const styleRules = require("./webpack-dist-style.config.js")

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
  ...styleRules
]

module.exports = require("./make-webpack-config")(rules, {
  _special: {
    separateStylesheets: true,
    sourcemaps: true,
  },
  entry: {
    "swagger-ui": [
      "./src/style/main.scss"
    ],
    "swagger-ui-bundle": [
      "./src/polyfills",
      "./src/core/index.js"
    ],
    "swagger-ui-standalone-preset": [
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
    disableHostCheck: true, // for development within VMs
    stats: {
      colors: true
    },
  },
})
