var path = require('path')

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
    use: [
      'style-loader',
      'css-loader',
      'postcss-loader'
    ]
  },
  { test: /\.(scss)(\?.*)?$/,
    use: [
      'style-loader',
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
  },
  { test: /\.(less)(\?.*)?$/,
    use: [
      'style-loader',
      'css-loader',
      {
        loader: 'postcss-loader',
      },
      'less-loader'
    ]
  }
]

module.exports = require('./make-webpack-config.js')(rules, {
  _special: {
    separateStylesheets: false,
    minimize: true,
    sourcemaps: true,
  },

  entry: {
    'swagger-ui-standalone-preset': [
      './src/polyfills',
      './src/standalone/index.js'
    ]
  },

  output:  {
    path: path.join(__dirname, "dist"),
    publicPath: "/dist",
    library: "SwaggerUIStandalonePreset",
    libraryTarget: "umd",
    filename: "[name].js",
    chunkFilename: "js/[name].js",
  },

})
