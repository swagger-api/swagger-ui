import reducers from "./reducers"
import * as actions from "./actions"
import * as selectors from "./selectors"

export default function() {
  return {
    statePlugins: {
      layout: {
        reducers,
        actions,
        selectors
      }
    }
  }
}
