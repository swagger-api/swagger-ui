/**
 * @prettier
 */
import { Map } from "immutable"
import isPlainObject from "lodash/isPlainObject"

export const schemaHasType = (schema, types) => {
  const isSchemaImmutable = Map.isMap(schema)

  if (!isSchemaImmutable && !isPlainObject(schema)) {
    return false
  }

  const type = isSchemaImmutable ? schema.get("type") : schema.type

  return types.includes(type)
}
