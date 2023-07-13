import StandaloneLayout from "./layout"
import "../style/main.scss"

import TopbarPlugin from "plugins/topbar"
import ConfigsPlugin from "plugins/configs"
import SamlAuthPlugin from "plugins/saml-auth"

// the Standalone preset

let preset = [
  TopbarPlugin,
  ConfigsPlugin,
  SamlAuthPlugin,
  () => {
    return {
      components: { StandaloneLayout },
    }
  },
]

module.exports = preset
