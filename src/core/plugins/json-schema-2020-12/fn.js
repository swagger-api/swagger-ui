/**
 * @prettier
 */
import { useFn } from "./hooks"

export const upperFirst = (value) => {
  if (typeof value === "string") {
    return `${value.charAt(0).toUpperCase()}${value.slice(1)}`
  }
  return value
}

export const getTitle = (schema) => {
  if (schema?.title) return upperFirst(schema.title)
  if (schema?.$anchor) return upperFirst(schema.$anchor)
  if (schema?.$id) return schema.$id

  return ""
}

export const getType = (schema, processedSchemas = new WeakSet()) => {
  const fn = useFn()

  if (schema == null) {
    return "any"
  }

  if (fn.isBooleanJSONSchema(schema)) {
    return schema ? "any" : "never"
  }

  if (typeof schema !== "object") {
    return "any"
  }

  if (processedSchemas.has(schema)) {
    return "any" // detect a cycle
  }
  processedSchemas.add(schema)

  const { type, prefixItems, items } = schema

  const getArrayType = () => {
    if (prefixItems) {
      const prefixItemsTypes = prefixItems.map((itemSchema) =>
        getType(itemSchema, processedSchemas)
      )
      const itemsType = items ? getType(items, processedSchemas) : "any"
      return `array<[${prefixItemsTypes.join(", ")}], ${itemsType}>`
    } else if (items) {
      const itemsType = getType(items, processedSchemas)
      return `array<${itemsType}>`
    } else {
      return "array<any>"
    }
  }

  const inferType = () => {
    if (prefixItems || items) {
      return getArrayType()
    } else if (schema.properties || schema.additionalProperties) {
      return "object"
    } else if (
      schema.pattern ||
      schema.format ||
      schema.minLength ||
      schema.maxLength
    ) {
      return "string"
    } else if (
      schema.minimum ||
      schema.maximum ||
      schema.exclusiveMinimum ||
      schema.exclusiveMaximum ||
      schema.multipleOf
    ) {
      return "number | integer"
    } else if (schema.const !== undefined) {
      if (schema.const === null) {
        return "null"
      } else if (typeof schema.const === "boolean") {
        return "boolean"
      } else if (typeof schema.const === "number") {
        return Number.isInteger(schema.const) ? "integer" : "number"
      } else if (typeof schema.const === "string") {
        return "string"
      } else if (typeof schema.const === "object") {
        return "object"
      }
    }
    return null
  }

  if (schema.not && getType(schema.not) === "any") {
    return "never"
  }

  const typeString = Array.isArray(type)
    ? type.map((t) => (t === "array" ? getArrayType() : t)).join(" | ")
    : type && type.includes("array")
    ? getArrayType()
    : type || inferType()

  const handleCombiningKeywords = (keyword, separator) => {
    if (Array.isArray(schema[keyword])) {
      const combinedTypes = schema[keyword].map((subSchema) =>
        getType(subSchema, processedSchemas)
      )
      return `(${combinedTypes.join(separator)})`
    }
    return null
  }

  const oneOfString = handleCombiningKeywords("oneOf", " | ")
  const anyOfString = handleCombiningKeywords("anyOf", " | ")
  const allOfString = handleCombiningKeywords("allOf", " & ")

  const combinedStrings = [typeString, oneOfString, anyOfString, allOfString]
    .filter(Boolean)
    .join(" | ")

  processedSchemas.delete(schema)

  return combinedStrings || "any"
}

export const isBooleanJSONSchema = (schema) => typeof schema === "boolean"

export const hasKeyword = (schema, keyword) =>
  typeof schema === "object" && Object.hasOwn(schema, keyword)

export const isExpandable = (schema) => {
  const fn = useFn()

  return (
    schema?.$schema ||
    schema?.$vocabulary ||
    schema?.$id ||
    schema?.$anchor ||
    schema?.$dynamicAnchor ||
    schema?.$ref ||
    schema?.$dynamicRef ||
    schema?.$defs ||
    schema?.$comment ||
    schema?.allOf ||
    schema?.anyOf ||
    schema?.oneOf ||
    fn.hasKeyword(schema, "not") ||
    fn.hasKeyword(schema, "if") ||
    fn.hasKeyword(schema, "then") ||
    fn.hasKeyword(schema, "else") ||
    schema?.dependentSchemas ||
    schema?.prefixItems ||
    schema?.items ||
    fn.hasKeyword(schema, "contains") ||
    schema?.properties ||
    schema?.patternProperties ||
    fn.hasKeyword(schema, "additionalProperties") ||
    fn.hasKeyword(schema, "propertyNames") ||
    fn.hasKeyword(schema, "unevaluatedItems") ||
    fn.hasKeyword(schema, "unevaluatedProperties") ||
    schema?.description ||
    schema?.enum ||
    fn.hasKeyword(schema, "const")
  )
}

export const stringify = (value) => {
  if (
    value === null ||
    ["number", "bigint", "boolean"].includes(typeof value)
  ) {
    return String(value)
  }

  if (Array.isArray(value)) {
    return `[${value.map(stringify).join(", ")}]`
  }

  return JSON.stringify(value)
}

const stringifyConstraintMultipleOf = (schema) => {
  if (typeof schema?.multipleOf !== "number") return null
  if (schema.multipleOf <= 0) return null
  if (schema.multipleOf === 1) return null

  const { multipleOf } = schema

  if (Number.isInteger(multipleOf)) {
    return `multiple of ${multipleOf}`
  }

  const decimalPlaces = multipleOf.toString().split(".")[1].length
  const factor = 10 ** decimalPlaces
  const numerator = multipleOf * factor
  const denominator = factor
  return `multiple of ${numerator}/${denominator}`
}

const stringifyConstraintNumberRange = (schema) => {
  const minimum = schema?.minimum
  const maximum = schema?.maximum
  const exclusiveMinimum = schema?.exclusiveMinimum
  const exclusiveMaximum = schema?.exclusiveMaximum
  const hasMinimum = typeof minimum === "number"
  const hasMaximum = typeof maximum === "number"
  const hasExclusiveMinimum = typeof exclusiveMinimum === "number"
  const hasExclusiveMaximum = typeof exclusiveMaximum === "number"
  const isMinExclusive = hasExclusiveMinimum && minimum < exclusiveMinimum
  const isMaxExclusive = hasExclusiveMaximum && maximum > exclusiveMaximum

  if (hasMinimum && hasMaximum) {
    const minSymbol = isMinExclusive ? "(" : "["
    const maxSymbol = isMaxExclusive ? ")" : "]"
    const minValue = isMinExclusive ? exclusiveMinimum : minimum
    const maxValue = isMaxExclusive ? exclusiveMaximum : maximum
    return `${minSymbol}${minValue}, ${maxValue}${maxSymbol}`
  }
  if (hasMinimum) {
    const minSymbol = isMinExclusive ? ">" : "≥"
    const minValue = isMinExclusive ? exclusiveMinimum : minimum
    return `${minSymbol} ${minValue}`
  }
  if (hasMaximum) {
    const maxSymbol = isMaxExclusive ? "<" : "≤"
    const maxValue = isMaxExclusive ? exclusiveMaximum : maximum
    return `${maxSymbol} ${maxValue}`
  }

  return null
}

export const stringifyConstraints = (schema) => {
  const constraints = []

  // Validation Keywords for Numeric Instances (number and integer)
  const constraintMultipleOf = stringifyConstraintMultipleOf(schema)
  if (constraintMultipleOf !== null) constraints.push(constraintMultipleOf)

  const constraintNumberRange = stringifyConstraintNumberRange(schema)
  if (constraintNumberRange !== null) constraints.push(constraintNumberRange)

  return constraints
}
