import * as fn from "./fn"
import * as selectors from "./selectors"
import RequestSnippets from "./request-snippets"
export default () => {
  return {
    components: {
      RequestSnippets
    },
    fn,
    statePlugins: {
      requestSnippets: {
        selectors
      }
    }
  }
}
