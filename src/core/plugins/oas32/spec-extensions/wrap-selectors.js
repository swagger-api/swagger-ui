/**
 * @prettier
 */
import { List, Map } from "immutable"
import { OPERATION_METHODS } from "core/plugins/spec/selectors"
import { createOnlyOAS32SelectorWrapper } from "../fn"

/**
 * Direct Path Item operation fields are the fixed, lowercase method names.
 */
const isDirectOperationField = (key) => OPERATION_METHODS.includes(key)

/**
 * additionalOperations keys use real HTTP casing (e.g. "COPY", "POST").
 * Entries that duplicate a fixed field (in any case) are invalid per OAS 3.2
 * and must be ignored.
 */
const isFixedFieldMethod = (method) =>
  OPERATION_METHODS.includes(String(method).toLowerCase())

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
 * Extends validOperationMethods for OAS 3.2.x with:
 * - QUERY (new fixed field)
 * - exact custom method tokens declared under Path Item `additionalOperations`
 *
 * Reference: https://spec.openapis.org/oas/v3.2.0.html#path-item-object
 */
export const validOperationMethods = createOnlyOAS32SelectorWrapper(
  () => (oriSelector, system) => {
    const validMethods = system.oas32Selectors.validOperationMethods()
    const customMethods = []
    const paths = system.specSelectors
      .specJsonWithResolvedSubtrees()
      .get("paths")

    if (paths?.forEach) {
      paths.forEach((pathItem) => {
        const additionalOperations = pathItem?.get?.("additionalOperations")

        if (additionalOperations?.forEach) {
          additionalOperations.forEach((operation, method) => {
            if (
              !isFixedFieldMethod(method) &&
              !customMethods.includes(method)
            ) {
              customMethods.push(method)
            }
          })
        }
      })
    }

    return validMethods.concat(customMethods)
  }
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
    .filter(([key]) => isDirectOperationField(key))
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
      .filter(([method]) => !isFixedFieldMethod(method))
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

export const selectWebhooksOperations = createOnlyOAS32SelectorWrapper(
  () => (oriSelector, system) => {
    const webhooks = system.specSelectors
      .specJsonWithResolvedSubtrees()
      .get("webhooks")
    if (!Map.isMap(webhooks)) return {}

    return webhooks
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
