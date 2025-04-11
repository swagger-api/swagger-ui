/**
 * @prettier
 */
import { Map } from "immutable"
import isPlainObject from "lodash/isPlainObject"

export const makeIsFileUploadIntended = (getSystem) => {
  const isFileUploadIntended = (schema, mediaType = null) => {
    const { fn } = getSystem()

    /**
     *  Return `true` early if the media type indicates a file upload
     *  or if a combination of type: `string` and format: `binary/byte` is detected.
     *  This ensures support for empty Media Type Objects,
     *  as the schema check is performed later.
     */
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
      (typeof contentMediaType === "string" && contentMediaType !== "") ||
      (typeof contentEncoding === "string" && contentEncoding !== "")
    )
  }

  return isFileUploadIntended
}
