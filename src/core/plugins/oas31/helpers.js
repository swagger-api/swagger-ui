/**
 * @prettier
 */
export const isOAS31 = (jsSpec) => {
  const oasVersion = jsSpec.get("openapi")

  return (
    typeof oasVersion === "string" && /^3\.1\.(?:[1-9]\d*|0)$/.test(oasVersion)
  )
}

export const onlyOAS31 =
  (selector) =>
  () =>
  (system, ...args) => {
    if (system.getSystem().specSelectors.isOAS31()) {
      const result = selector(...args)
      return typeof result === "function" ? result(system, ...args) : result
    } else {
      return null
    }
  }
