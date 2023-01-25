import { createSelector } from "reselect"
import { Map } from "immutable"
import { isOAS3 as isOAS3Helper, isOpenAPI31 as isOpenAPI31Helper, isSwagger2 as isSwagger2Helper } from "../helpers"


// Helpers

// 1/2023: as of now, more accurately, isAnyOAS3
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

function isOpenAPI31(selector) {
  return () => (system, ...args) => {
    const spec = system.getSystem().specSelectors.specJson()
    if (isOpenAPI31Helper(spec)) {
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

export const selectIsOpenAPI31 = (ori, system) => () => {
  const spec = system.getSystem().specSelectors.specJson()
  return isOpenAPI31Helper(spec)
}

export const selectWebhooks = isOpenAPI31(createSelector(
  spec,
  spec => spec.getIn(["webhooks"]) || Map()
))
