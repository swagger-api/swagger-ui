import * as selectors from "./selectors"
import * as actions from "./actions"
import reducers from "./reducers"
import FeaturesPopupButton from "./features-popup"

export default () => ({
  components: {
    FeaturesPopupButton
  },
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
