import { createSelector } from "reselect"
import { Map } from "immutable"

// Helpers

function onlyOAS3(selector) {
  return (ori, system) => (...args) => {
    const spec = system.getSystem().specSelectors.specJson()
    const version = spec.get("openapi")
    if(typeof version === "string" && version.startsWith("3.0.0")) {
      return selector(...args)
    } else {
      return ori(...args)
    }
  }
}

const state = state => {
  return state || Map()
}

const specJson = createSelector(
  state,
  spec => spec.get("json", Map())
)

const specResolved = createSelector(
  state,
  spec => spec.get("resolved", Map())
)

const spec = state => {
  let res = specResolved(state)
  if(res.count() < 1)
    res = specJson(state)
  return res
}

// Wrappers

export const definitions = onlyOAS3(createSelector(
  spec,
  spec => spec.getIn(["components", "schemas"]) || Map()
))
