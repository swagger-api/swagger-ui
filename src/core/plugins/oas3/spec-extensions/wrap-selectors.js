import { createSelector } from "reselect"
import { specJsonWithResolvedSubtrees } from "../../spec/selectors"
import { Map } from "immutable"
import { isOAS3 as isOAS3Helper, isSwagger2 as isSwagger2Helper } from "../helpers"


// Helpers

function onlyOAS3(selector) {
  return (ori, system) => (...args) => {
    const spec = system.getSystem().specSelectors.specJson()
    if(isOAS3Helper(spec)) {
      return selector(...args)
    } else {
      return ori(...args)
    }
  }
}

const state = state => {
  return state || Map()
}

const nullSelector = createSelector(() => null)

const OAS3NullSelector = onlyOAS3(nullSelector)

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
  spec => {
    const res = spec.getIn(["components", "schemas"])
    return Map.isMap(res) ? res : Map()
  }
))

export const hasHost = onlyOAS3((state) => {
  return spec(state).hasIn(["servers", 0])
})

export const securityDefinitions = onlyOAS3(createSelector(
  specJsonWithResolvedSubtrees,
  spec => spec.getIn(["components", "securitySchemes"]) || null
))

export const host = OAS3NullSelector
export const basePath = OAS3NullSelector
export const consumes = OAS3NullSelector
export const produces = OAS3NullSelector
export const schemes = OAS3NullSelector

// New selectors

export const servers = onlyOAS3(createSelector(
  spec,
  spec => spec.getIn(["servers"]) || Map()
))

export const isOAS3 = (ori, system) => () => {
  const spec = system.getSystem().specSelectors.specJson()
  return isOAS3Helper(Map.isMap(spec) ? spec : Map())
}

export const isSwagger2 = (ori, system) => () => {
  const spec = system.getSystem().specSelectors.specJson()
  return isSwagger2Helper(Map.isMap(spec) ? spec : Map())
}
