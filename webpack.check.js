const webpack = require('webpack')
const path = require('path')
const deepMerge = require('deepmerge')
const webpackConfig = require('./webpack-dist-bundle.config.js')
const DEPS_CHECK_DIR = require('./package.json').config.deps_check_dir

module.exports = deepMerge(
  webpackConfig, {
    output: {
      path: path.join(__dirname, DEPS_CHECK_DIR)
    }
  }
)
