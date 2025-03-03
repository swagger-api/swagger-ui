/**
 * @prettier
 */

export const getIsFileFormat = (schema) => {
  if (!schema) return false

  const isStringType = schema.get("type") === "string"
  const format = schema.get("format")
  const isBinaryFormat = format === "binary"
  const isBase64Format = format === "base64" || format === "byte"

  return isStringType && (isBinaryFormat || isBase64Format)
}

export const getIsFileContentType = (contentType) =>
  contentType === "application/octet-stream" ||
  contentType?.indexOf("image/") === 0 ||
  contentType?.indexOf("audio/") === 0 ||
  contentType?.indexOf("video/") === 0
