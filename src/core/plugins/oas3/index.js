// import reducers from "./reducers"
// import * as actions from "./actions"
import * as wrapSelectors from "./wrap-selectors"
// import * as wrapActions from "./wrap-actions"

export default function() {
  return {
    components: {

    },
    statePlugins: {
      spec: {
        // wrapActions,
        // reducers,
        // actions,
        wrapSelectors
      }
    }
  }
}
