/**
 * @prettier
 */
import reducers from "./reducers"
import * as actions from "./actions"
import * as selectors from "./selectors"
import * as wrapActions from "./wrap-actions"

const SpecPlugin = () => ({
  statePlugins: {
    spec: {
      wrapActions: { ...wrapActions },
      reducers: { ...reducers },
      actions: { ...actions },
      selectors: { ...selectors },
    },
  },
})

export default SpecPlugin
