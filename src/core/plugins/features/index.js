import * as selectors from "./selectors"
import * as actions from "./actions"
import reducers from "./reducers"
import makeFn from "./fn"
import FeaturesPopupButton from "./features-popup"

export default (system) => ({
  components: {
    FeaturesPopupButton
  },
  fn: makeFn(system),
  statePlugins: {
    features: {
      selectors,
      actions,
      reducers
    }
  },
  afterLoad: (system) => {
    system.featuresActions.clearOldPersistedFeatures()
    system.featuresActions.tryLoadPersistedFeatures()
  },
})
