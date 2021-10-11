import agate from "react-syntax-highlighter/dist/cjs/styles/hljs/agate"
import arta from "react-syntax-highlighter/dist/cjs/styles/hljs/arta"
import monokai from "react-syntax-highlighter/dist/cjs/styles/hljs/monokai"
import nord from "react-syntax-highlighter/dist/cjs/styles/hljs/nord"
import obsidian from "react-syntax-highlighter/dist/cjs/styles/hljs/obsidian"
import tomorrowNight from "react-syntax-highlighter/dist/cjs/styles/hljs/tomorrow-night"

const internalStylePreset = {agate, arta, monokai, nord, obsidian, "tomorrow-night": tomorrowNight}

export default system => ({
  getAvailableStyles: () => internalStylePreset,
  getStyle: name => {
    const styles = system.getSystem().fn.getAvailableStyles()
    if (!Object.keys(styles).includes(name)) {
      console.warn(`Request style '${name}' is not available, returning default instead`)
      return agate
    }
    return styles[name]
  }
})
