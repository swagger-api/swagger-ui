// import reducers from "./reducers"
// import * as actions from "./actions"
import * as selectors from "./selectors"
// import * as wrapActions from "./wrap-actions"

export default function(system) {
  return {
    components: {

    },
    statePlugins: {
      spec: {
        // wrapActions,
        // reducers,
        // actions,
        selectors
      }
    }
  }
}
