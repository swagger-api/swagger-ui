import * as actions from "./actions"
import * as specActions from "./spec-actions"
import reducers from "./reducers"
import * as selectors from "./selectors"
import * as wrapActions from "./wrap-actions"
import ChangeHistoryContainer from "core/containers/change-history"
import * as fn from "./fn"

const ChangeHistoryPlugin = () => ({
  statePlugins: {
    changeHistory: {
      actions: { ...actions, ...specActions },
      reducers,
      selectors,
    },
    spec: {
      wrapActions: {
        updateJsonSpec: wrapActions.updateJsonSpec,
      },
    },
    configs: {
      wrapActions: {
        loaded: wrapActions.loaded,
      },
    },
  },
  components: {
    ChangeHistoryContainer,
  },
  fn: {
    ...fn,
  },
})

export default ChangeHistoryPlugin
