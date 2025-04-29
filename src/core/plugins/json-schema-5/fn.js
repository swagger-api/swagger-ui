/**
 * @prettier
 */
import { Map } from "immutable"
import isPlainObject from "lodash/isPlainObject"

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
