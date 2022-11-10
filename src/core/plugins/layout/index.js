import reducers from "./reducers"
import * as actions from "./actions"
import * as selectors from "./selectors"
import * as wrapSelectors from "./spec-extensions/wrap-selector"

export default function() {
  return {
    statePlugins: {
      layout: {
        reducers,
        actions,
        selectors
      },
      spec: {
        wrapSelectors
      }
    }
  }
}
