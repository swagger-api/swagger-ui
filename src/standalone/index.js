import StandaloneLayout from "./layout"
import TopbarPlugin from "plugins/topbar"
import ConfigsPlugin from "corePlugins/configs"
import SafeRenderPlugin from "core/plugins/safe-render"

// the Standalone preset

export default [
  TopbarPlugin,
  ConfigsPlugin,
  () => {
    return {
      components: { StandaloneLayout }
    }
  },
  SafeRenderPlugin({
    fullOverride: true,
    componentList: [
      "Topbar",
      "StandaloneLayout",
      "onlineValidatorBadge"
    ]
  })
]
