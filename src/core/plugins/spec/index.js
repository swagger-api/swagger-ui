import reducers from "./reducers"
import * as actions from "./actions"
import * as selectors from "./selectors"
import * as wrapActions from "./wrap-actions"

export default function() {
  return {
    statePlugins: {
      spec: {
        wrapActions,
        reducers,
        actions,
        selectors
      }
    }
  }
}
