try {
  module.exports.SwaggerUIBundle = require("./swagger-ui-bundle.js")
  module.exports.SwaggerUIStandalonePreset = require("./swagger-ui-standalone-preset.js")
} catch(e) {
  // swallow the error if there's a problem loading the assets.
  // allows this module to support providing the assets for browserish contexts,
  // without exploding in a Node context.
  //
  // see https://github.com/swagger-api/swagger-ui/issues/3291#issuecomment-311195388
  // for more information.
}

module.exports.absolutePath = require("./absolute-path.js")
