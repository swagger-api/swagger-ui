import BasePreset from "./base"

import LowlightCode from "../../plugins/lowlight/lowlight.jsx"
import LowlightCss from "../../plugins/lowlight/style.scss"

// Base preset, with Syntax highlight

export default function PresetHighlight() {

  return [
    BasePreset,
    {
        components: {
            highlightCode: LowlightCode,
        }
    }
  ]
}
