/**
 * @prettier
 */
import { Map } from "immutable"
import isPlainObject from "lodash/isPlainObject"

export const makeIsFileUploadIntended = (getSystem) => {
  const isFileUploadIntended = (schema, mediaType = null) => {
    const { fn } = getSystem()

    const isFileUploadIntendedOAS30 = fn.isFileUploadIntendedOAS30(
      schema,
      mediaType
    )

    if (isFileUploadIntendedOAS30) {
      return true
    }

    const isSchemaImmutable = Map.isMap(schema)

    if (!isSchemaImmutable && !isPlainObject(schema)) {
      return false
    }

    const contentMediaType = isSchemaImmutable
      ? schema.get("contentMediaType")
      : schema.contentMediaType
    const contentEncoding = isSchemaImmutable
      ? schema.get("contentEncoding")
      : schema.contentEncoding

    return (
      (contentMediaType && typeof contentMediaType === "string") ||
      (contentEncoding && typeof contentEncoding === "string")
    )
  }

  return isFileUploadIntended
}
