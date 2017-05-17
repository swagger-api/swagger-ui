import { createSelector } from "reselect"
// import { sorters } from "core/utils"
// import { fromJS, Set, Map, List } from "immutable"

const DEFAULT_TAG = "default"

const state = state => {
  return state || Map()
}

// export const specJson = createSelector(
//   state,
//   spec => spec.get("json", Map())
// )
//
// export const specResolved = createSelector(
//   state,
//   spec => spec.get("resolved", Map())
// )
//
// export const spec = state => {
//   let res = specResolved(state)
//   if(res.count() < 1)
//     res = specJson(state)
//   return res
// }
//
// export const findDefinition = ( state, name ) => {
//   return specResolved(state).getIn(["definitions", name], null)
// }
//
// export const definitions = onlyOAS3(createSelector(
//   spec,
//   spec => spec.getIn(["components", "schemas"]) || Map()
// ))

// helpers

function onlyOAS3(selector) {
  return ( state ) => ( thing ) => {
    return selector
  }
}
