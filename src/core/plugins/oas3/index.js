// import reducers from "./reducers"
// import * as actions from "./actions"
import * as wrapSelectors from "./wrap-selectors"
import wrapComponents from "./wrap-components"

export default function() {
  return {
    components: {

    },
    wrapComponents,
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
