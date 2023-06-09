/**
 * @prettier
 */
export const isURI = (uri) => {
  try {
    return new URL(uri) && true
  } catch {
    return false
  }
}
