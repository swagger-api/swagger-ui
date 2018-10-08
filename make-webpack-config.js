var path = require("path")

var webpack = require("webpack")
var ExtractTextPlugin = require("extract-text-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
var deepExtend = require("deep-extend")
const {gitDescribeSync} = require("git-describe")
const os = require("os")

var pkg = require("./package.json")

let gitInfo

try {
  gitInfo = gitDescribeSync(__dirname)
} catch(e) {
  gitInfo = {
    hash: "noGit",
    dirty: false
  }
}

var commonRules = [
  { test: /\.(js(x)?)(\?.*)?$/,
    use: [{
      loader: "babel-loader",
      options: {
        retainLines: true
      }
    }],
    include: [
      path.join(__dirname, "src"),
      path.join(__dirname, "node_modules", "object-assign-deep"),
    ]
  },
  { test: /\.(txt|yaml)(\?.*)?$/,
    loader: "raw-loader" },
  { test: /\.(png|jpg|jpeg|gif|svg)(\?.*)?$/,
    loader: "url-loader?limit=10000" },
  { test: /\.(woff|woff2)(\?.*)?$/,
    loader: "url-loader?limit=100000" },
  { test: /\.(ttf|eot)(\?.*)?$/,
    loader: "file-loader" }
]

module.exports = function(rules, options) {

  // Special options, that have logic in this file
  // ...with defaults
  var specialOptions = deepExtend({}, {
    hot: false,
    separateStylesheets: true,
    minimize: false,
    mangle: false,
    longTermCaching: false,
    sourcemaps: false,
  }, options._special)

  var plugins = []

  if( specialOptions.separateStylesheets ) {
    plugins.push(new ExtractTextPlugin({
      filename: "[name].css" + (specialOptions.longTermCaching ? "?[contenthash]" : ""),
      allChunks: true
    }))
  }

  if( specialOptions.minimize ) { // production mode

    plugins.push(
      new UglifyJsPlugin({
        uglifyOptions: {
          mangle: specialOptions.mangle,
          compress: specialOptions.mangle,
          beautify: !specialOptions.mangle,
        },
        
        sourceMap: true,
      }),
      new webpack.LoaderOptionsPlugin({
        options: {
          context: __dirname
        }
      })
    )

    plugins.push( new webpack.NoEmitOnErrorsPlugin())

  } else { // development mode
    plugins.push(new CopyWebpackPlugin([ { from: "test/e2e-selenium/specs", to: "test-specs" } ]))
  }

  plugins.push(
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV:  specialOptions.minimize ? JSON.stringify("production") : null,
        WEBPACK_INLINE_STYLES: !specialOptions.separateStylesheets
      },
      "buildInfo": JSON.stringify({
        PACKAGE_VERSION: (pkg.version),
        GIT_COMMIT: gitInfo.hash,
        GIT_DIRTY: gitInfo.dirty,
        HOSTNAME: os.hostname(),
        BUILD_TIME: new Date().toUTCString()
      })
    }))

  delete options._special

  var completeConfig = deepExtend({
    entry: {},

    output:  {
      path: path.join(__dirname, "dist"),
      publicPath: "/",
      filename: "[name].js",
      chunkFilename: "[name].js"
    },

    target: "web",

    // yaml-js has a reference to `fs`, this is a workaround
    node: {
      fs: "empty"
    },

    module: {
      rules: commonRules.concat(rules),
    },

    resolveLoader: {
      modules: [path.join(__dirname, "node_modules")],
    },

    externals: {
      "buffertools": true // json-react-schema/deeper depends on buffertools, which fails.
    },

    resolve: {
      modules: [
        path.join(__dirname, "./src"),
        "node_modules"
      ],
      extensions: [".web.js", ".js", ".jsx", ".json", ".less"],
      alias: {
        "js-yaml": "@kyleshockey/js-yaml"
      }
    },

  devtool: specialOptions.sourcemaps ? "nosource-source-map" : false,

    plugins,

  }, options)

  return completeConfig
}
