import makeReducers from "./reducers"
import * as actions from "./actions"
import * as selectors from "./selectors"

export default function(system) {
  return {
    statePlugins: {
      err: {
        reducers: makeReducers(system),
        actions,
        selectors
      }
    }
  }
}
