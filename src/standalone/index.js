import StandaloneLayout from "./layout"
import TopbarPlugin from "plugins/topbar"
import LeftbarPlugin from "plugins/leftbar"
import ConfigsPlugin from "corePlugins/configs"

// the Standalone preset

export default [
  TopbarPlugin,
  LeftbarPlugin,
  ConfigsPlugin,
  () => {
    return {
      components: { StandaloneLayout }
    }
  }
]
