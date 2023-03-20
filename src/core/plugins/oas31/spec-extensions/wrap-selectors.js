/**
 * @prettier
 */

/**
 * Selector wrapper maker the only wraps the passed selector
 * when spec is of OpenAPI 3.1.0 version.
 */
const onlyOAS31Wrap =
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

export const isOAS3 =
  (oriSelector, system) =>
  (state, ...args) => {
    const isOAS31 = system.specSelectors.isOAS31()
    return isOAS31 || oriSelector(...args)
  }

export const selectLicenseUrl = onlyOAS31Wrap(() => (system) => {
  return system.oas31Selectors.selectLicenseUrl()
})
