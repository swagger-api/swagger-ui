// import reducers from "./reducers"
// import * as actions from "./actions"
// import * as selectors from "./selectors"
import * as layoutWrapActions from "./layout-wrap-actions"

export default function() {
  return {
    statePlugins: {
      layout: {
        wrapActions: layoutWrapActions
      }
    }
  }
}
