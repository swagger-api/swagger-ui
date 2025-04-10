/**
 * @prettier
 */
import { Map } from "immutable"

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

  if (!Map.isMap(schema)) return false

  const type = schema.get("type")
  const format = schema.get("format")

  return type === "string" && ["binary", "byte"].includes(format)
}
