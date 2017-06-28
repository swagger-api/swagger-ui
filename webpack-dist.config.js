var path = require('path')
var fs = require('fs')
const nodeModules = fs.readdirSync("node_modules").filter(function(x) { return x !== ".bin" })
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var rules = [
  { test: /\.(worker\.js)(\?.*)?$/,
    use: [
      {
        loader: 'worker-loader',
        options: {
          inline: true,
          name: '[name].js'
        }
      },
      { loader: 'babel-loader' }
    ]
  },
  { test: /\.(css)(\?.*)?$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        'css-loader',
        'postcss-loader'
      ]
    })
  },
  { test: /\.(scss)(\?.*)?$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        'css-loader',
        {
          loader: 'postcss-loader',
          options: { sourceMap: true }
        },
        { loader: 'sass-loader',
          options: {
            outputStyle: 'expanded',
            sourceMap: true,
            sourceMapContents: 'true'
          }
        }
      ]
    })
  },
  { test: /\.(less)(\?.*)?$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: ['css-loader',
        {
          loader: 'postcss-loader',
        },
        'less-loader'
      ]
    })
  }
]

module.exports = require('./make-webpack-config.js')(rules, {
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
