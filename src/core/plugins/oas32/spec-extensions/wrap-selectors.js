/**
 * @prettier
 */
import { createSelector } from "reselect"
import { List, Map } from "immutable"
import {
  isOperationMethodField,
  isFixedOperationMethod,
} from "core/utils/operation-methods"
import { createOnlyOAS32SelectorWrapper } from "../fn"

/**
 * Wraps isOAS3 selector to return true when spec is OAS 3.2.x
 * This ensures OAS 3.2 specs are recognized as OAS 3.x for
 * OAS3-specific features like servers, security, etc.
 */
export const isOAS3 =
  (oriSelector, system) =>
  (state, ...args) => {
    const isOAS32 = system.specSelectors.isOAS32()
    return isOAS32 || oriSelector(...args)
  }

/**
 * Memoized: recomputes only when the base list or the resolved `paths` change.
 */
const selectValidOperationMethods = createSelector(
  [(baseMethods) => baseMethods, (baseMethods, paths) => paths],
  (baseMethods, paths) => {
    const customMethods = []

    if (Map.isMap(paths)) {
      paths.forEach((pathItem) => {
        const additionalOperations = Map.isMap(pathItem)
          ? pathItem.get("additionalOperations")
          : null

        if (Map.isMap(additionalOperations)) {
          additionalOperations.forEach((operation, method) => {
            if (
              !isFixedOperationMethod(method) &&
              !customMethods.includes(method)
            ) {
              customMethods.push(method)
            }
          })
        }
      })
    }

    return baseMethods.concat(customMethods)
  }
)

/**
 * Extends validOperationMethods for OAS 3.2.x with:
 * - QUERY (new fixed field)
 * - exact custom method tokens declared under Path Item `additionalOperations`
 *
 * Reference: https://spec.openapis.org/oas/v3.2.0.html#path-item-object
 */
export const validOperationMethods = createOnlyOAS32SelectorWrapper(
  () => (oriSelector, system) =>
    selectValidOperationMethods(
      system.oas32Selectors.validOperationMethods(),
      system.specSelectors.specJsonWithResolvedSubtrees().get("paths")
    )
)

/**
 * Collects operation DTOs from a single Path Item:
 * - fixed-field operations (get, post, ..., query)
 * - custom operations under `additionalOperations`, keeping exact method tokens
 */
const pathItemOperations = (pathItem, specPath) => {
  if (!Map.isMap(pathItem)) return List()

  const operations = pathItem
    .entrySeq()
    .filter(([key]) => isOperationMethodField(key))
    .map(([method, operation]) => ({
      operation: Map({ operation }),
      method,
      specPath: specPath.concat([method]),
    }))
    .toList()

  const additionalOperations = pathItem.get("additionalOperations")
  if (!Map.isMap(additionalOperations)) return operations

  return operations.concat(
    additionalOperations
      .entrySeq()
      .filter(([method]) => !isFixedOperationMethod(method))
      .map(([method, operation]) => ({
        operation: Map({ operation }),
        method,
        specPath: specPath.concat(["additionalOperations", method]),
      }))
  )
}

export const callbacksOperations = createOnlyOAS32SelectorWrapper(
  (state, { callbacks, specPath }) =>
    () => {
      if (!Map.isMap(callbacks)) return {}

      return callbacks
        .reduce((allOperations, callback, callbackName) => {
          if (!Map.isMap(callback)) return allOperations

          return allOperations.concat(
            callback.reduce(
              (callbackOps, pathItem, expression) =>
                callbackOps.concat(
                  pathItemOperations(
                    pathItem,
                    specPath.concat([callbackName, expression])
                  ).map((operationDTO) => ({
                    ...operationDTO,
                    path: expression,
                    callbackName,
                  }))
                ),
              List()
            )
          )
        }, List())
        .groupBy((operationDTO) => operationDTO.callbackName)
        .map((operations) => operations.toArray())
        .toObject()
    }
)

export const webhooks = createOnlyOAS32SelectorWrapper(
  () => (oriSelector, system) => {
    const value = system.specSelectors
      .specJsonWithResolvedSubtrees()
      .get("webhooks")
    return Map.isMap(value) ? value : Map()
  }
)

/**
 * Memoized on the resolved `webhooks` map, matching the OAS 3.1 selector.
 */
const selectWebhooksOperationsFromMap = createSelector(
  [(webhooksMap) => webhooksMap],
  (webhooksMap) => {
    if (!Map.isMap(webhooksMap)) return {}

    return webhooksMap
      .reduce(
        (allOperations, pathItem, pathItemName) =>
          allOperations.concat(
            pathItemOperations(pathItem, ["webhooks", pathItemName]).map(
              (operationDTO) => ({ ...operationDTO, path: pathItemName })
            )
          ),
        List()
      )
      .groupBy((operationDTO) => operationDTO.path)
      .map((operations) => operations.toArray())
      .toObject()
  }
)

export const selectWebhooksOperations = createOnlyOAS32SelectorWrapper(
  () => (oriSelector, system) =>
    selectWebhooksOperationsFromMap(
      system.specSelectors.specJsonWithResolvedSubtrees().get("webhooks")
    )
)
