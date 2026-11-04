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

const getType = (
  schema,
  processedSchemas = new WeakSet(),
  withFormat = false
) => {
  if (schema == null) {
    return "any"
  }

  if (processedSchemas.has(schema)) {
    return "any" // detect a cycle
  }

  processedSchemas.add(schema)

  const { type, format, items } = schema

  const getArrayType = () => {
    if (items) {
      // Inline items format (e.g. "string($uuid)") inside the array<...> label,
      // because the array's items have no separate rendering path that would
      // append their format. See issue #4516.
      const itemsType = getType(items, processedSchemas, true)
      return `array<${itemsType}>`
    } else {
      return "array<any>"
    }
  }

  if (Object.hasOwn(schema, "items")) {
    return getArrayType()
  }
  if (withFormat && type && format) {
    return `${type}($${format})`
  }
  return type
}

export const getSchemaObjectTypeLabel = (schema) =>
  getType(immutableToJS(schema))
