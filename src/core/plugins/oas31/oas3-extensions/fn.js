/**
 * @prettier
 */
import { immutableToJS } from "core/utils"

export const isFileUploadIntended = (schema, mediaType = null) => {
  if (
    typeof mediaType === "string" &&
    (mediaType.startsWith("application/octet-stream") ||
      mediaType.startsWith("image/") ||
      mediaType.startsWith("audio/") ||
      mediaType.startsWith("video/"))
  ) {
    return true
  }

  if (!schema) return null

  const type = immutableToJS(schema.get("type"))
  const isTypeString =
    type === "string" || (Array.isArray(type) && type.includes("string"))
  const format = schema.get("format")

  return isTypeString && (format === "binary" || format === "byte")
}
