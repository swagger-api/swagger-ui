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

export const persistFeatures = () => ( { featuresSelectors, getState } ) => {
  const features = featuresSelectors.getFeaturesState()
    .updateIn(
      ["presets"],
      (presets) => presets.map((ft, key) => ft.mergeDeepIn(["state"], getState().get(key, Map())))
    )

  localStorage.setItem(storageKey(), JSON.stringify(features.toJS()))
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
    if(!localStorage.hasOwnProperty(possibleFeaturesBackup)) {
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
export const tryLoadPersistedFeatures = () => {
  const features = fromJS(JSON.parse(localStorage.getItem(storageKey())))
  if(!features) {
    return {
      type: NOOP_FEATURES
    }
  }
  return {
    type: UPDATE_FEATURES,
    payload: features
  }
}
