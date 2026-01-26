/**
 * @prettier
 */
import { createOnlyOAS32SelectorWrapper } from "../fn"

/**
 * Wraps isOAS31 selector to return false when spec is OAS 3.2.x
 * This ensures OAS 3.2 specs are not detected as OAS 3.1
 */
export const isOAS31 = createOnlyOAS32SelectorWrapper(() => () => false)

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
