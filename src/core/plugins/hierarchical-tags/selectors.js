import { createSelector } from "reselect"
import { Map } from "immutable"

const state = state => state || Map()

export const isEnabled = createSelector(
  state,
  state => state.get("enabled", false)
)

export const getTagDelimiter = createSelector(
  state,
  state => state.get( "delimiter", "|")
)
