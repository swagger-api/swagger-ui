/**
 * @prettier
 */
import { isBooleanJSONSchema, isJSONSchemaObject } from "./predicates"

export const fromJSONBooleanSchema = (schema) => {
  if (schema === false) {
    return { not: {} }
  }

  return {}
}

export const typeCast = (schema) => {
  if (isBooleanJSONSchema(schema)) {
    return fromJSONBooleanSchema(schema)
  }
  if (!isJSONSchemaObject(schema)) {
    return {}
  }

  return schema
}
