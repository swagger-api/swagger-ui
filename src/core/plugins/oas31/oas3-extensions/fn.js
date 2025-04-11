/**
 * @prettier
 */

export const makeIsFileUploadIntended = (getSystem) => {
  const isFileUploadIntended = (schema, mediaType = null) => {
    const { fn } = getSystem()

    return fn.isFileUploadIntendedOAS30(schema, mediaType)
  }

  return isFileUploadIntended
}
