const config = require("./webpack-dist.config.js")

config.plugins = config.plugins.filter(plugin => {
  // Disable minification
  return plugin.constructor.name !== "UglifyJsPlugin"
})

module.exports = config
