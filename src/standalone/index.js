import StandaloneLayout from "./layout"
import "../style/main.scss"

import TopbarPlugin from "plugins/topbar"

// the Standalone preset

let preset = [
  TopbarPlugin,
  () => {
    return {
      components: { StandaloneLayout }
    }
  }
]

module.exports = preset
