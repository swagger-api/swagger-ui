/**
 * @prettier
 */
import { Map } from "immutable"
import isPlainObject from "lodash/isPlainObject"

export const makeIsFileUploadIntended = (getSystem) => {
  const isFileUploadIntended = (schema, mediaType = null) => {
    const { getConfigs, fn } = getSystem()
    const { fileUploadMediaTypes } = getConfigs()
    const isFileUploadMediaType =
      typeof mediaType === "string" &&
      fileUploadMediaTypes.some((fileUploadMediaType) =>
        mediaType.startsWith(fileUploadMediaType)
      )

    if (isFileUploadMediaType) {
      return true
    }

    const isSchemaImmutable = Map.isMap(schema)

    if (!isSchemaImmutable && !isPlainObject(schema)) {
      return false
    }

    const format = isSchemaImmutable ? schema.get("format") : schema.format

    return (
      fn.hasSchemaType(schema, "string") && ["binary", "byte"].includes(format)
    )
  }

  return isFileUploadIntended
}

/**
 * Returns the name of the Media Type Object field that describes the payload.
 * OpenAPI 3.0.x and 3.1.x only define `schema`; OpenAPI 3.2 overrides this
 * to support `itemSchema` for sequential media types.
 */
export const getMediaTypeSchemaField = () => "schema"
