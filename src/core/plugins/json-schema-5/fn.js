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
