/**
 * @prettier
 */
import { immutableToJS } from "core/utils"

export const makeGetIsFileFormat = (fn) => {
  const getIsFileFormat = (schema) => {
    if (!schema) return null

    const type = fn.jsonSchema202012.getType(immutableToJS(schema))
    const isFileContentMediaType = fn.getIsFileContentType(
      schema.get("contentMediaType")
    )
    const isBase64Encoding = schema.get("contentEncoding") === "base64"

    return (
      (type === "string" || type === "any") &&
      (isFileContentMediaType || isBase64Encoding)
    )
  }

  return getIsFileFormat
}
