/**
 * @prettier
 */
import { createSelector } from "reselect"
import { specJsonWithResolvedSubtrees } from "../../spec/selectors"
import { Map } from "immutable"

/**
 * Helpers
 */

const map = Map()

function onlyOAS3(selector) {
  return (ori, system) =>
    (...args) => {
      if (system.getSystem().specSelectors.isOAS3()) {
        const result = selector(...args)
        return typeof result === "function" ? result(system) : result
      } else {
        return ori(...args)
      }
    }
}

const nullSelector = createSelector(() => null)

const OAS3NullSelector = onlyOAS3(nullSelector)

/**
 * Wrappers
 */

export const definitions = onlyOAS3(() => (system) => {
  const spec = system.getSystem().specSelectors.specJson()
  const schemas = spec.getIn(["components", "schemas"])
  return Map.isMap(schemas) ? schemas : map
})

export const hasHost = onlyOAS3(() => (system) => {
  const spec = system.getSystem().specSelectors.specJson()
  return spec.hasIn(["servers", 0])
})

export const securityDefinitions = onlyOAS3(
  createSelector(
    specJsonWithResolvedSubtrees,
    (spec) => spec.getIn(["components", "securitySchemes"]) || null
  )
)

export const validOperationMethods =
  (oriSelector, system) =>
  (state, ...args) => {
    if (system.specSelectors.isOAS3()) {
      return system.oas3Selectors.validOperationMethods()
    }

    return oriSelector(...args)
  }

export const host = OAS3NullSelector
export const basePath = OAS3NullSelector
export const consumes = OAS3NullSelector
export const produces = OAS3NullSelector
export const schemes = OAS3NullSelector
