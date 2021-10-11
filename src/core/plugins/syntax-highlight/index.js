import buildFn from "./fn"
import { SyntaxHighlighter } from "./syntax-highlight"

export default (system) => ({
  components: {
    SyntaxHighlighter
  },
  fn: buildFn(system),
})
