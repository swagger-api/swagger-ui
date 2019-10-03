/**
 * @prettier
 */

import { Map } from "immutable"

/**
 * Checks whether a value is valid against a Request Body definition.
 *
 * Note that this does _not_ take any schemas within the Request Body into
 * account, you'll need to use a schema+value validation function for that.
 *
 * @param {ImmutableMap} requestBody - the Request Body definition
 * @param {any} value - the provided value for the Request body
 * @returns {boolean} whether the value is valid
 *
 */
export default function validateRequestBodyValue(requestBody, value) {
  if (!Map.isMap(requestBody)) {
    throw new Error("Request Body must be an Immutable.js Map")
  }

  if (requestBody.get("required")) {
    if (value === null || value === undefined || value === "") {
      return false
    }
  }

  return true
}
