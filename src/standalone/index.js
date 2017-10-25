import StandaloneLayout from "./layout"
import TopbarPlugin from "plugins/topbar"
import ConfigsPlugin from "plugins/configs"

// the Standalone preset

let preset = [
  TopbarPlugin,
  ConfigsPlugin,
  () => {
    return {
      components: { StandaloneLayout }
    }
  }
]

module.exports = preset
