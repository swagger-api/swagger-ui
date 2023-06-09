/**
 * @prettier
 */
import isPlainObject from "lodash/isPlainObject"

export const isURI = (uri) => {
  try {
    return new URL(uri) && true
  } catch {
    return false
  }
}

export const isBooleanJSONSchema = (schema) => {
  return typeof schema === "boolean"
}

export const isJSONSchemaObject = (schema) => {
  return isPlainObject(schema)
}

export const isJSONSchema = (schema) => {
  return isBooleanJSONSchema(schema) || isJSONSchemaObject(schema)
}
