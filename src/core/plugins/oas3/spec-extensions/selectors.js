/**
 * @prettier
 */
import { List, Map } from "immutable"

import {
  isSwagger2 as isSwagger2Helper,
  isOAS30 as isOAS30Helper,
} from "../helpers"

/**
 * Helpers
 */

const map = Map()

export const isSwagger2 = () => (system) => {
  const spec = system.getSystem().specSelectors.specJson()
  return isSwagger2Helper(spec)
}

export const isOAS30 = () => (system) => {
  const spec = system.getSystem().specSelectors.specJson()
  return isOAS30Helper(spec)
}

export const isOAS3 = () => (system) => {
  return system.getSystem().specSelectors.isOAS30()
}

function onlyOAS3(selector) {
  return (state, ...args) =>
    (system) => {
      if (system.specSelectors.isOAS3()) {
        const selectedValue = selector(state, ...args)
        return typeof selectedValue === "function"
          ? selectedValue(system)
          : selectedValue
      } else {
        return null
      }
    }
}

export const servers = onlyOAS3(() => (system) => {
  const spec = system.specSelectors.specJson()
  return spec.get("servers", map)
})

export const findSchema = (state, schemaName) => {
  const resolvedSchema = state.getIn(
    ["resolvedSubtrees", "components", "schemas", schemaName],
    null
  )
  const unresolvedSchema = state.getIn(
    ["json", "components", "schemas", schemaName],
    null
  )

  return resolvedSchema || unresolvedSchema || null
}

export const callbacksOperations = onlyOAS3(
  (state, { callbacks, specPath }) =>
    (system) => {
      const validOperationMethods = system.specSelectors.validOperationMethods()

      if (!Map.isMap(callbacks)) return {}

      return callbacks
        .reduce((allOperations, callback, callbackName) => {
          if (!Map.isMap(callback)) return allOperations

          const callbackOperations = callback.reduce(
            (callbackOps, pathItem, expression) => {
              if (!Map.isMap(pathItem)) return callbackOps

              const pathItemOperations = pathItem
                .entrySeq()
                .filter(([key]) => validOperationMethods.includes(key))
                .map(([method, operation]) => ({
                  operation: Map({ operation }),
                  method,
                  path: expression,
                  callbackName,
                  specPath: specPath.concat([callbackName, expression, method]),
                }))

              return callbackOps.concat(pathItemOperations)
            },
            List()
          )

          return allOperations.concat(callbackOperations)
        }, List())
        .groupBy((operationDTO) => operationDTO.callbackName)
        .map((operations) => operations.toArray())
        .toObject()
    }
)
