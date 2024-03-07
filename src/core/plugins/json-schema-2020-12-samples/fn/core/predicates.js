/**
 * @prettier
 */
import isPlainObject from "lodash/isPlainObject"

export const isBooleanJSONSchema = (schema) => {
  return typeof schema === "boolean"
}

export const isJSONSchemaObject = (schema) => {
  return isPlainObject(schema)
}

export const isJSONSchema = (schema) => {
  return isBooleanJSONSchema(schema) || isJSONSchemaObject(schema)
}
