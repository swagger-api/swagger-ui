import * as fn from "./fn"
import * as selectors from "./selectors"
import * as actions from "./actions"
import reducers from "./reducers"
import { RequestSnippets } from "./request-snippets"
// eslint-disable-next-line camelcase
import { settings_requestSnippets } from "./settings-request-snippets"
export default () => {
  return {
    components: {
      RequestSnippets,
      // eslint-disable-next-line camelcase
      settings_requestSnippets
    },
    fn,
    statePlugins: {
      requestSnippets: {
        selectors,
        actions,
        reducers
      }
    }
  }
}
