/**
 * @prettier
 */
import { objectify } from "core/utils"

export const makeIsFileUploadIntended = (getSystem) => {
  const isFileUploadIntended = (schema, mediaType = null) => {
    const { fileUploadMediaTypes } = getSystem().getConfigs()
    const isFileUploadMediaType =
      typeof mediaType === "string" &&
      fileUploadMediaTypes.some((fileUploadMediaType) =>
        mediaType.startsWith(fileUploadMediaType)
      )

    if (isFileUploadMediaType) {
      return true
    }

    const { type, format } = objectify(schema)
    const includesStringType =
      type === "string" || (Array.isArray(type) && type.includes("string"))

    return includesStringType && ["binary", "byte"].includes(format)
  }

  return isFileUploadIntended
}
