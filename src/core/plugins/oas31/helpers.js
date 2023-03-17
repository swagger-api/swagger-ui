/**
 * @prettier
 */

export const isOAS31 = (jsSpec) => {
  const oasVersion = jsSpec.get("openapi")

  return (
    typeof oasVersion === "string" && /^3\.1\.(?:[1-9]\d*|0)$/.test(oasVersion)
  )
}

/**
 * Selector maker the only calls the passed selector
 * when spec is of OpenAPI 3.1.0 version.
 */
export const onlyOAS31 =
  (selector) =>
  (state, ...args) =>
  (system) => {
    if (system.getSystem().specSelectors.isOAS31()) {
      const result = selector(state, ...args)
      return typeof result === "function" ? result(system) : result
    } else {
      return null
    }
  }

/**
 * Selector wrapper maker the only wraps the passed selector
 * when spec is of OpenAPI 3.1.0 version.
 */
export const onlyOAS31Wrap =
  (selector) =>
  (oriSelector, system) =>
  (state, ...args) => {
    if (system.getSystem().specSelectors.isOAS31()) {
      const result = selector(state, ...args)
      return typeof result === "function" ? result(system) : result
    } else {
      return oriSelector(...args)
    }
  }
