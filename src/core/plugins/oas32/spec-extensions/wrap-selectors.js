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
 * Wraps operationsWithRootInherited selector to include QUERY method operations for OAS 3.2.x
 *
 * We wrap operationsWithRootInherited instead of operations because:
 * - operations is a memoized createSelector that may be cached before our wrapper runs
 * - operationsWithRootInherited consumes operations output and runs later in the chain
 * - This ensures QUERY operations are added after the base operations are collected
 *
 * Reference: https://spec.openapis.org/oas/v3.2.0.html#path-item-object
 */
export const operationsWithRootInherited = (oriSelector, system) => {
  return (state, ...args) => {
    const isOAS32Selector = system.specSelectors.isOAS32
    let isOAS32 = false

    if (typeof isOAS32Selector === "function") {
      const result = isOAS32Selector()
      isOAS32 = typeof result === "function" ? result(system) : result
    }

    if (!isOAS32) {
      return oriSelector(state, ...args)
    }

    // For OAS 3.2, we need to manually add query operations
    // Get operations with inherited root (consumes/produces)
    let list = oriSelector(state, ...args)

    const paths = system.specSelectors.paths()
    if (!Map.isMap(paths) || paths.isEmpty()) {
      return list
    }

    // Get root-level consumes/produces for consistency
    const spec = system.specSelectors.specJson()
    const rootConsumes = spec.get("consumes") || fromJS([])
    const rootProduces = spec.get("produces") || fromJS([])

    // Add query operations to the list with inherited root values
    paths.forEach((path, pathName) => {
      if (!path || !path.forEach) {
        return
      }
      const queryOperation = path.get("query")
      if (queryOperation) {
        // Build operation with inherited consumes/produces (matching operationsWithRootInherited pattern)
        let operation = queryOperation
        if (Map.isMap(operation)) {
          operation = operation.withMutations((op) => {
            if (!op.get("consumes")) {
              op.set("consumes", rootConsumes)
            }
            if (!op.get("produces")) {
              op.set("produces", rootProduces)
            }
          })
        }

        list = list.push(
          fromJS({
            path: pathName,
            method: "query",
            operation: operation,
            id: `query-${pathName}`,
          })
        )
      }
    })

    return list
  }
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
    const isOAS32Selector = system.specSelectors.isOAS32
    let isOAS32 = false

    if (typeof isOAS32Selector === "function") {
      const result = isOAS32Selector()
      isOAS32 = typeof result === "function" ? result(system) : result
    }

    if (isOAS32) {
      return system.oas32Selectors.validOperationMethods()
    }

    return oriSelector(...args)
  }
