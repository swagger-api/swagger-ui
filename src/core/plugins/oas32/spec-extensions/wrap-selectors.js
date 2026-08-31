/**
 * @prettier
 */
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
 * Wraps validOperationMethods to include QUERY method for OAS 3.2.x
 * OAS 3.2.0 adds support for the QUERY HTTP method per
 * draft-ietf-httpbis-safe-method-w-body
 *
 * Reference: https://spec.openapis.org/oas/v3.2.0.html#path-item-object
 */
export const validOperationMethods = createOnlyOAS32SelectorWrapper(
  () => (oriSelector, system) => system.oas32Selectors.validOperationMethods()
)
