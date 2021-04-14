import { fromJS, Map} from "immutable"
import SwaggerUI from "../../index"

export const TOGGLE_FEATURE = "feature_toggle"
export const UPDATE_FEATURES = "features_update"
export const NOOP_FEATURES = "features_noop"
const storageKey = () => "features-" + window.versions.swaggerUi.version

export const toggleFeature = (key) => {
  return {
    type: TOGGLE_FEATURE,
    payload: key
  }
}

export const persistFeatures = () => ( { getSystem } ) => {
  const {featuresSelectors, getState} = getSystem()

  const features = featuresSelectors.getFeaturesState()
  const presets = features
    .get("presets", Map())
    .map((ft, key) => ft.mergeDeepIn(["state"], getState().get(key, Map())))
    .filter((_, key) => featuresSelectors.isFeatureUserChangeable(key))

  localStorage.setItem(storageKey(), JSON.stringify(presets.toJS()))
  return {
    type: NOOP_FEATURES
  }
}

export const resetFeatures = () => {
  localStorage.removeItem(storageKey())
  return {
    type: UPDATE_FEATURES,
    payload: fromJS(SwaggerUI.features)
  }
}
export const clearOldPersistedFeatures = () => {
  localStorage.getItem(storageKey())
  for (const possibleFeaturesBackup in localStorage) {
    if(!Object.prototype.hasOwnProperty.call(localStorage, possibleFeaturesBackup)) {
      continue
    }
    if(!possibleFeaturesBackup.startsWith("features-")) {
      continue
    }
    if(possibleFeaturesBackup === storageKey()) {
      continue
    }
    localStorage.removeItem(possibleFeaturesBackup)
  }
  return {
    type: NOOP_FEATURES
  }
}
