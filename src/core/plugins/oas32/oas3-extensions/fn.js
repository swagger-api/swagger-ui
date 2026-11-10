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

/**
 * OpenAPI 3.2 lets a Media Type Object describe a sequential media type
 * (e.g. `text/event-stream`, `application/jsonl`, `application/json-seq`,
 * `multipart/mixed`) with `itemSchema`, the schema of each item in the
 * sequence, instead of `schema`. When only `itemSchema` is present we use it
 * as the payload schema so its example and model can be rendered.
 */
export const getMediaTypeSchemaField = (mediaType) => {
  const isMediaTypeImmutable = Map.isMap(mediaType)

  if (!isMediaTypeImmutable && !isPlainObject(mediaType)) {
    return "schema"
  }

  const has = (field) =>
    isMediaTypeImmutable
      ? mediaType.get(field) != null
      : mediaType[field] != null

  return !has("schema") && has("itemSchema") ? "itemSchema" : "schema"
}
