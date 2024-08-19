import * as actions from "./actions"
import * as selectors from "./selectors"
import reducers from "./reducers"

export default function configsPlugin() {

  return {
    statePlugins: {
      configs: {
        reducers,
        actions,
        selectors,
      }
    }
  }
}
