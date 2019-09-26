/**
 * @prettier
 */

import Im from "immutable"

const swagger2SchemaKeys = Im.Set.of(
  "type",
  "format",
  "items",
  "default",
  "maximum",
  "exclusiveMaximum",
  "minimum",
  "exclusiveMinimum",
  "maxLength",
  "minLength",
  "pattern",
  "maxItems",
  "minItems",
  "uniqueItems",
  "enum",
  "multipleOf"
)

/**
 * Get the effective schema value for a parameter, or an empty Immutable.Map if
 * no suitable schema can be found.
 *
 * Supports OpenAPI 3.0 `Parameter.content` priority -- since a Parameter Object
 * cannot have both `schema` and `content`, this function ignores `schema` when
 * `content` is present.
 *
 * @param {Immutable.Map} parameter The parameter to identify a schema for
 * @param {object} config
 * @param {boolean} config.isOAS3 Whether the parameter is from an OpenAPI 2.0
 * or OpenAPI 3.0 definition
 * @return {Immutable.Map} The desired schema
 */
export default function getParameterSchema(parameter, { isOAS3 } = {}) {
  // Return empty Map if `parameter` isn't a Map
  if (!Im.Map.isMap(parameter)) return Im.Map()

  if (!isOAS3) {
    // Swagger 2.0
    if (parameter.get("in") === "body") {
      return parameter.get("schema", Im.Map())
    } else {
      return parameter.filter((v, k) => swagger2SchemaKeys.includes(k))
    }
  }

  // If we've reached here, the parameter is OpenAPI 3.0

  if (parameter.get("content")) {
    const parameterContentMediaTypes = parameter
      .get("content", Im.Map({}))
      .keySeq()

    return parameter.getIn(
      ["content", parameterContentMediaTypes.first(), "schema"],
      Im.Map()
    )
  }

  return parameter.get("schema", Im.Map())
}
