const config = require("./webpack-dist.config.js")

config.plugins = config.plugins.filter(plugin => {
  // Disable minification
  return plugin.constructor.name !== "UglifyJsPlugin"
})

config.module.rules = config.module.rules.filter(rule => {
  // Disable minification
  return rule.loader != "webpack-strip-block"
})

module.exports = config
