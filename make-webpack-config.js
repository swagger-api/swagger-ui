var path = require('path')

var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var deepExtend = require('deep-extend')
var autoprefixer = require('autoprefixer')
const {gitDescribeSync} = require('git-describe');

var loadersByExtension = require('./build-tools/loadersByExtension')

var pkg = require('./package.json')

let gitInfo

try {
  gitInfo = gitDescribeSync(__dirname)
} catch(e) {
  gitInfo = {
    hash: 'noGit',
    dirty: false
  }
}

module.exports = function(options) {

  // Special options, that have logic in this file
  // ...with defaults
  var specialOptions = deepExtend({}, {
    hot: false,
    separateStylesheets: true,
    minimize: false,
    longTermCaching: false,
    sourcemaps: false,
  }, options._special)

  var loadersMap = {
    'js(x)?': {
      loader: 'babel?retainLines=true',
      include: [ path.join(__dirname, 'src') ],
    },
    'json': 'json-loader',
    'txt|yaml': 'raw-loader',
    'png|jpg|jpeg|gif|svg': specialOptions.disableAssets ? 'null-loader' : 'url-loader?limit=10000',
    'woff|woff2': specialOptions.disableAssets ? 'null-loader' : 'url-loader?limit=100000',
    'ttf|eot':  specialOptions.disableAssets ? 'null-loader' : 'file-loader',
    "worker.js": ["worker-loader?inline=true", "babel"]
  }

  var plugins = []

  if( specialOptions.separateStylesheets ) {
    plugins.push(new ExtractTextPlugin('[name].css' + (specialOptions.longTermCaching ? '?[contenthash]' : ''), {
      allChunks: true
    }))
  }

  if( specialOptions.minimize ) {

    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false
        }
      }),
      new webpack.optimize.DedupePlugin()
    )

    plugins.push( new webpack.NoErrorsPlugin())

  }

  plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV:  specialOptions.minimize ? JSON.stringify('production') : null,
        WEBPACK_INLINE_STYLES: !Boolean(specialOptions.separateStylesheets)

      },
      'buildInfo': JSON.stringify({
        PACKAGE_VERSION: (pkg.version),
        GIT_COMMIT: gitInfo.hash,
        GIT_DIRTY: gitInfo.dirty
      })
    }))

  var cssLoader = 'css-loader!postcss-loader'

  var completeStylesheetLoaders = deepExtend({
    'css': cssLoader,
    'scss': cssLoader + '!' + 'sass-loader?outputStyle=expanded&sourceMap=true&sourceMapContents=true',
    'less': cssLoader + '!' + 'less-loader',
  }, specialOptions.stylesheetLoaders)

  if(specialOptions.cssModules) {
    cssLoader = cssLoader + '?module' +  (specialOptions.minimize ? '' : '&localIdentName=[path][name]---[local]---[hash:base64:5]')
  }

  Object.keys(completeStylesheetLoaders).forEach(function(ext) {
    var ori = completeStylesheetLoaders[ext]
    if(specialOptions.separateStylesheets) {
      completeStylesheetLoaders[ext] = ExtractTextPlugin.extract('style-loader', ori)
    } else {
      completeStylesheetLoaders[ext] = 'style-loader!' + ori
    }
  })

  var loaders = loadersByExtension(deepExtend({}, loadersMap, specialOptions.loaders, completeStylesheetLoaders))
  var extraLoaders = (options.module || {} ).loaders

  if(Array.isArray(extraLoaders)) {
    loaders = loaders.concat(extraLoaders)
    delete options.module.loaders
  }

  var completeConfig =  deepExtend({
    entry: {},

    output:  {
      path: path.join(__dirname, 'dist'),
      publicPath: '/',
      filename: '[name].js',
      chunkFilename: '[name].js'
    },

    target: 'web',

    // yaml-js has a reference to `fs`, this is a workaround
    node: {
      fs: 'empty'
    },

    module: {
      loaders: loaders,
    },

    resolveLoader: {
      root: path.join(__dirname, 'node_modules'),
    },

    externals: {
      'buffertools': true // json-react-schema/deeper depends on buffertools, which fails.
    },

    resolve: {
      root: path.join(__dirname, './src'),
      modulesDirectories: ['node_modules'],
      extensions: ["", ".web.js", ".js", ".jsx", ".json", ".less"],
      packageAlias: 'browser',
      alias: {
        base: "getbase/src/less/base"
      }
    },

    postcss: function() {
      return [autoprefixer]
    },

    devtool: specialOptions.sourcemaps ? 'cheap-module-source-map' : null,

    plugins,

  }, options)

  return completeConfig
}
