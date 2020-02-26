import StandaloneLayout from "./layout"
import TopbarPlugin from "plugins/topbar"
import ConfigsPlugin from "corePlugins/configs"

// the Standalone preset

export default [
  TopbarPlugin,
  ConfigsPlugin,
  () => {
    return {
      components: { StandaloneLayout }
    }
  }
]
