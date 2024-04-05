/**
 * @prettier
 */
import afterLoad from "./after-load"
import { styles, defaultStyle } from "./root-injects"
import SyntaxHighlighter from "./components/SyntaxHighlighter"
import HighlightCode from "./components/HighlightCode"
import PlainTextViewer from "./components/PlainTextViewer"
import SyntaxHighlighterWrapper from "./wrap-components/SyntaxHighlighter"

const SyntaxHighlightingPlugin1 = () => ({
  afterLoad,
  rootInjects: {
    syntaxHighlighting: { styles, defaultStyle },
  },
  components: {
    SyntaxHighlighter,
    HighlightCode,
    PlainTextViewer,
  },
})

const SyntaxHighlightingPlugin2 = () => ({
  wrapComponents: {
    SyntaxHighlighter: SyntaxHighlighterWrapper,
  },
})

const SyntaxHighlightingPlugin = () => [
  SyntaxHighlightingPlugin1,
  SyntaxHighlightingPlugin2,
]

export default SyntaxHighlightingPlugin
