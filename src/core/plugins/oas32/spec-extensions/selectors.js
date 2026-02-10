/**
 * @prettier
 */
import { isOAS32 } from "../fn"

/**
 * Detects if the current spec is OAS 3.2.x
 */
export const selectIsOAS32 = (state, system) => () => {
  const spec = system.specSelectors.specJson()
  return isOAS32(spec)
}

/**
 * Checks if any path has QUERY operations
 * OAS 3.2 spec reference: https://spec.openapis.org/oas/v3.2.0.html#path-item-object
 *
 * Supports QUERY HTTP method per draft-ietf-httpbis-safe-method-w-body
 */
export const selectHasQueryOperations = () => (system) => {
  const spec = system.specSelectors.specJson()
  const paths = spec.get("paths")
  if (!paths || !paths.size) return false

  return paths.some((pathItem) => pathItem && pathItem.has("query"))
}
