import { createSelector } from "reselect"
import { normalizeArray } from "core/utils"

const state = state => state

export const current = state => state.get("layout")

export const currentFilter = state => state.get("filter")

export const isShown = (state, thing, def) => {
  thing = normalizeArray(thing)
  return Boolean(state.getIn(["shown", ...thing], def))
}

export const whatMode = (state, thing, def="") => {
  thing = normalizeArray(thing)
  return state.getIn(["modes", ...thing], def)
}

export const showSummary = createSelector(
  state,
  state => !isShown(state, "editor")
)

