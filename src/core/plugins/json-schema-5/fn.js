/**
 * @prettier
 */
import { Map } from "immutable"
import isPlainObject from "lodash/isPlainObject"
import { immutableToJS } from "core/utils"

export const hasSchemaType = (schema, type) => {
  const isSchemaImmutable = Map.isMap(schema)

  if (!isSchemaImmutable && !isPlainObject(schema)) {
    return false
  }

  const schemaType = isSchemaImmutable ? schema.get("type") : schema.type

  return (
    type === schemaType || (Array.isArray(type) && type.includes(schemaType))
  )
}

const getType = (schema, processedSchemas = new WeakSet()) => {
  if (schema == null) {
    return "any"
  }

  if (processedSchemas.has(schema)) {
    return "any" // detect a cycle
  }

  processedSchemas.add(schema)

  const { type, items } = schema

  const getArrayType = () => {
    if (items) {
      const itemsType = getType(items, processedSchemas)
      return `array<${itemsType}>`
    } else {
      return "array<any>"
    }
  }

  if (Object.hasOwn(schema, "items")) {
    return getArrayType()
  }
  return type
}

export const getSchemaObjectTypeLabel = (schema) =>
  getType(immutableToJS(schema))

// For OpenAPI 2.0 and 3.0 (JSON Schema Draft 4/5)
// where exclusiveMinimum and exclusiveMaximum are booleans
export const stringifyConstraintNumberRange = (schema) => {
  // Handle both plain objects and Immutable Maps
  const minimum = schema?.get ? schema.get("minimum") : schema?.minimum
  const maximum = schema?.get ? schema.get("maximum") : schema?.maximum
  const exclusiveMinimum = schema?.get ? schema.get("exclusiveMinimum") : schema?.exclusiveMinimum
  const exclusiveMaximum = schema?.get ? schema.get("exclusiveMaximum") : schema?.exclusiveMaximum
  
  const hasMinimum = typeof minimum === "number"
  const hasMaximum = typeof maximum === "number"
  const isMinExclusive = exclusiveMinimum === true
  const isMaxExclusive = exclusiveMaximum === true

  if (hasMinimum && hasMaximum) {
    const minSymbol = isMinExclusive ? "(" : "["
    const maxSymbol = isMaxExclusive ? ")" : "]"
    return `${minSymbol}${minimum}, ${maximum}${maxSymbol}`
  }
  if (hasMinimum) {
    const minSymbol = isMinExclusive ? ">" : "≥"
    return `${minSymbol} ${minimum}`
  }
  if (hasMaximum) {
    const maxSymbol = isMaxExclusive ? "<" : "≤"
    return `${maxSymbol} ${maximum}`
  }

  return null
}
