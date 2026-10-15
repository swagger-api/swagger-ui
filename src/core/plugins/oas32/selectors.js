/**
 * @prettier
 */
import constant from "lodash/constant"
import { OPERATION_METHODS } from "core/utils/operation-methods"

/**
 * Valid HTTP operation methods for OAS 3.2.x
 *
 * OAS 3.2.0 adds support for the QUERY HTTP method per
 * draft-ietf-httpbis-safe-method-w-body
 *
 * Reference: https://spec.openapis.org/oas/v3.2.0.html#path-item-object
 */
export const validOperationMethods = constant(OPERATION_METHODS)
