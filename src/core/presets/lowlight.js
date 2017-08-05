import LowlightCode from "../../plugins/lowlight/lowlight.jsx"

// Preset with Syntax highlight
export default function PresetLowlight() {

  return [
    {
        components: {
            highlightCode: LowlightCode,
        }
    }
  ]
}
