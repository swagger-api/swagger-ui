/**
 * @prettier
 */

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

  if (!schema) return false

  const type = schema.get("type")
  const format = schema.get("format")

  return type === "string" && (format === "binary" || format === "byte")
}
