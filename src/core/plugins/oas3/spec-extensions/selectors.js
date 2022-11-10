import { createSelector } from "reselect"
import { Map } from "immutable"
import { isOAS3 as isOAS3Helper, isSwagger2 as isSwagger2Helper } from "../helpers"


// Helpers

function onlyOAS3(selector) {
  return () => (system, ...args) => {
    const spec = system.getSystem().specSelectors.specJson()
    if(isOAS3Helper(spec)) {
      return selector(...args)
    } else {
      return null
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

// New selectors

export const servers = onlyOAS3(createSelector(
  spec,
  spec => spec.getIn(["servers"]) || Map()
))

export const isSwagger2 = (ori, system) => () => {
  const spec = system.getSystem().specSelectors.specJson()
  return isSwagger2Helper(spec)
}
