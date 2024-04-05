/**
 * @prettier
 */
import afterLoad from "./after-load"
import { styles, defaultStyle } from "./root-injects"
import SyntaxHighlighter from "./components/SyntaxHighlighter"
import HighlightCode from "./components/HighlightCode"

const SyntaxHighlightingPlugin = () => ({
  afterLoad,
  rootInjects: {
    syntaxHighlighting: { styles, defaultStyle },
  },
  components: {
    SyntaxHighlighter,
    HighlightCode,
  },
})

export default SyntaxHighlightingPlugin
