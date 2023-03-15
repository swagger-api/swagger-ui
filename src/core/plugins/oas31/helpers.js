/**
 * @prettier
 */
export const isOAS31 = (jsSpec) => {
  const oasVersion = jsSpec.get("openapi")

  return (
    typeof oasVersion === "string" && /^3\.1\.(?:[1-9]\d*|0)$/.test(oasVersion)
  )
}
