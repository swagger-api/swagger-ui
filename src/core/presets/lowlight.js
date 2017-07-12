import BasePreset from "./base"

import LowlightCode from "../../plugins/lowlight/lowlight.jsx"

// Base preset, with Syntax highlight

export default function PresetLowlight() {

  return [
    BasePreset,
    {
        components: {
            highlightCode: LowlightCode,
        }
    }
  ]
}
