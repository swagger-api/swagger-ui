// import reducers from "./reducers"
// import * as actions from "./actions"
// import * as selectors from "./selectors"
import * as specWrapActions from "./spec-wrap-actions"
import * as layoutWrapActions from "./layout-wrap-actions"

export default function() {
  return {
    statePlugins: {
      spec: {
        wrapActions: specWrapActions
      },
      layout: {
        wrapActions: layoutWrapActions
      }
    }
  }
}
