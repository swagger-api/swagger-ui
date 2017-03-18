import * as AST from "./ast"
import JumpToPath from "./jump-to-path"

export default function() {
  return {
    fn: { AST },
    components: { JumpToPath }
  }
}
