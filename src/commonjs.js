'use strict'; // eslint-disable-line
// import ApisPreset from "./core/presets/apis"
// import AllPlugins from "./core/plugins/all"

// const { default: SwaggerUI } = require("./core")
import SwaggerUI from "./core"

// Add presets
// SwaggerUI.presets = {
//   apis: ApisPreset,
// }

// All Plugins
// SwaggerUI.plugins = AllPlugins

module.exports = {
  default: SwaggerUI
}
