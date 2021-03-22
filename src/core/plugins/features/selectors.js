import { List, Map } from "immutable"

export const getPreviewFeatures = (state) => state.get("presets") || Map()
export const getFeaturesState = (state) => state || Map()

export const isFeatureEnabled = (state, key) =>
  getPreviewFeatures(state)
    .getIn([key, "enabled"])


export const isFeatureUserChangeable = (state, key) =>
  !state
    .get("staticPresets", List())
    .includes(key)
