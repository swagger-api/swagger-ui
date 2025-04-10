/**
 * @prettier
 */
import { Map } from "immutable"

import { immutableToJS } from "core/utils"

export const isFileUploadIntended = (
  schema,
  { mediaType = null, fileUploadMediaTypes = [] } = {}
) => {
  const isFileUploadMediaType =
    typeof mediaType === "string" &&
    fileUploadMediaTypes.some((fileUploadMediaType) =>
      mediaType.startsWith(fileUploadMediaType)
    )

  if (isFileUploadMediaType) {
    return true
  }

  if (!Map.isMap(schema)) return null

  const type = immutableToJS(schema.get("type"))
  const includesStringType =
    type === "string" || (Array.isArray(type) && type.includes("string"))
  const format = schema.get("format")

  return includesStringType && ["binary", "byte"].includes(format)
}
