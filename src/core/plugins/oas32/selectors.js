/**
 * @prettier
 */
import constant from "lodash/constant"

/**
 * Valid HTTP operation methods for OAS 3.2.x
 *
 * OAS 3.2.0 adds support for the QUERY HTTP method per
 * draft-ietf-httpbis-safe-method-w-body
 *
 * Reference: https://spec.openapis.org/oas/v3.2.0.html#path-item-object
 */
export const validOperationMethods = constant([
  "get",
  "put",
  "post",
  "delete",
  "options",
  "head",
  "patch",
  "trace",
  "query", // NEW in OAS 3.2
])
