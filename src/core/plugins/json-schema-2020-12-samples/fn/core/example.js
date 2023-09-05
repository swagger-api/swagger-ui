/**
 * @prettier
 */
import { isJSONSchemaObject } from "./predicates"

/**
 * Precedence of keywords that provides author defined values (top of the list = higher priority)
 *
 *  ### examples
 *  Array containing example values for the item defined by the schema.
 *  Not guaranteed to be valid or invalid against the schema
 *
 *  ### default
 *  Default value for an item defined by the schema.
 *  Is expected to be a valid instance of the schema.
 *
 *  ### example
 *  Deprecated. Part of OpenAPI 3.1.0 Schema Object dialect.
 *  Represents single example. Equivalent of `examples` keywords
 *  with single item.
 */

export const hasExample = (schema) => {
  if (!isJSONSchemaObject(schema)) return false

  const { examples, example, default: defaultVal } = schema

  if (Array.isArray(examples) && examples.length >= 1) {
    return true
  }

  if (typeof defaultVal !== "undefined") {
    return true
  }

  return typeof example !== "undefined"
}

export const extractExample = (schema) => {
  if (!isJSONSchemaObject(schema)) return null

  const { examples, example, default: defaultVal } = schema

  if (Array.isArray(examples) && examples.length >= 1) {
    return examples.at(0)
  }

  if (typeof defaultVal !== "undefined") {
    return defaultVal
  }

  if (typeof example !== "undefined") {
    return example
  }

  return undefined
}
