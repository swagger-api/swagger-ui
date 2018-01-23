import { List } from "immutable"
import { createSelector } from "reselect"

const state = state => state

export const allErrors = createSelector(
  state,
  err => err.get("errors", List())
)

export const lastError = createSelector(
  allErrors,
  all => all.last()
)

