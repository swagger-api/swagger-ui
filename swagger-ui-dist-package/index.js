const path = require('path')

module.exports.SwaggerUIBundle = require('./swagger-ui-bundle.js')
module.exports.SwaggerUIStandalonePreset = require('./swagger-ui-standalone-preset.js')

module.exports.absolutePath = path.resolve(__dirname)
