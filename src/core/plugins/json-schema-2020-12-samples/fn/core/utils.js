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

export const padZeros = (number, targetLength) => {
  let numString = "" + number
  while (numString.length < targetLength) {
    numString = "0" + numString
  }
  return numString
}
