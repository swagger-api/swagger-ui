const path = require("path")
const fs = require("fs")
const nodeModules = fs.readdirSync("node_modules").filter(function(x) { return x !== ".bin" })
const styleRules = require("./webpack.dist-style.config.js")

let rules = [
  { test: /\.(worker\.js)(\?.*)?$/,
    use: [
      {
        loader: "worker-loader",
        options: {
          inline: true,
          name: "[name].js"
        }
      },
      { loader: "babel-loader?retainLines=true" }
    ]
  }
]
rules = rules.concat(styleRules)

module.exports = require("./make-webpack-config.js")(rules, {
  _special: {
    separateStylesheets: true,
    minimize: true,
    sourcemaps: true,
  },

  entry: {
    "swagger-ui": [
      "./src/style/main.scss",
      "./src/polyfills",
      "./src/core/index.js"
    ]
  },

  externals: function(context, request, cb) {
    // webpack injects some stuff into the resulting file,
    // these libs need to be pulled in to keep that working.
    var exceptionsForWebpack = ["ieee754", "base64-js"]
    if(nodeModules.indexOf(request) !== -1 || exceptionsForWebpack.indexOf(request) !== -1) {
      cb(null, "commonjs " + request)
      return
    }
    cb()
  },

  output:  {
    path: path.join(__dirname, "dist"),
    publicPath: "/dist",
    library: "SwaggerUICore",
    libraryTarget: "umd",
    filename: "[name].js",
    chunkFilename: "js/[name].js",
  },

})
