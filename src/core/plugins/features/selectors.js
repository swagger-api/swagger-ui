import { Map } from "immutable"

export const getPreviewFeatures = (state) => state || Map()

export const isFeatureEnabled = (state, key) =>
  getPreviewFeatures(state)
    .getIn([key, "enabled"])
