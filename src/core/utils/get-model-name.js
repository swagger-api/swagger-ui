/**
 * @prettier
 */
export const decodeRefName = (uri) => {
  const unescaped = uri.replace(/~1/g, "/").replace(/~0/g, "~")

  try {
    return decodeURIComponent(unescaped)
  } catch {
    return unescaped
  }
}

export const getModelName = (ref) => {
  if (typeof ref !== "string") return null

  if (ref.indexOf("#/definitions/") !== -1) {
    return decodeRefName(ref.replace(/^.*#\/definitions\//, ""))
  }
  if (ref.indexOf("#/components/schemas/") !== -1) {
    return decodeRefName(ref.replace(/^.*#\/components\/schemas\//, ""))
  }
  return null
}
