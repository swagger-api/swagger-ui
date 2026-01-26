/**
 * @prettier
 */
import { fromJS, Map } from "immutable"
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
 * Wraps isOAS31 selector to return false when spec is OAS 3.2.x
 * This ensures OAS 3.2 specs are not detected as OAS 3.1
 */
export const isOAS31 = createOnlyOAS32SelectorWrapper(() => () => false)

/**
 * Wraps operations selector to include QUERY method operations for OAS 3.2.x
 * The base operations selector filters by OPERATION_METHODS constant which
 * doesn't include "query". This wrapper adds query operations for OAS 3.2.
 *
 * Reference: https://spec.openapis.org/oas/v3.2.0.html#path-item-object
 */
export const operations =
  (oriSelector, system) =>
  (state, ...args) => {
    const isOAS32 =
      system.specSelectors.isOAS32 && system.specSelectors.isOAS32()
    if (!isOAS32) {
      return oriSelector(state, ...args)
    }

    // For OAS 3.2, we need to manually add query operations
    // since they're filtered out by the base selector
    const paths = system.specSelectors.paths()
    let list = oriSelector(state, ...args)

    if (!Map.isMap(paths) || paths.isEmpty()) {
      return list
    }

    // Add query operations to the list
    paths.forEach((path, pathName) => {
      if (!path || !path.forEach) {
        return
      }
      const queryOperation = path.get("query")
      if (queryOperation) {
        list = list.push(
          fromJS({
            path: pathName,
            method: "query",
            operation: queryOperation,
            id: `query-${pathName}`,
          })
        )
      }
    })

    return list
  }

/**
 * Wraps validOperationMethods to include QUERY method for OAS 3.2.x
 * OAS 3.2.0 adds support for the QUERY HTTP method per
 * draft-ietf-httpbis-safe-method-w-body
 *
 * Reference: https://spec.openapis.org/oas/v3.2.0.html#path-item-object
 */
export const validOperationMethods =
  (oriSelector, system) =>
  (state, ...args) => {
    if (system.specSelectors.isOAS32()) {
      return system.oas32Selectors.validOperationMethods()
    }

    return oriSelector(...args)
  }
