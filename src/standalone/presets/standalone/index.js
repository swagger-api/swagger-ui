/**
 * @prettier
 */
import StandaloneLayoutPlugin from "standalone/plugins/stadalone-layout"
import TopBarPlugin from "standalone/plugins/top-bar"
import ConfigsPlugin from "core/plugins/configs"
import SafeRenderPlugin from "core/plugins/safe-render"

const StandalonePreset = [
  TopBarPlugin,
  ConfigsPlugin,
  StandaloneLayoutPlugin,
  SafeRenderPlugin({
    fullOverride: true,
    componentList: ["Topbar", "StandaloneLayout", "onlineValidatorBadge"],
  }),
]

export default StandalonePreset
