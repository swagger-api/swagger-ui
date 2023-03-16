/**
 * @prettier
 */
export const isOAS3 =
  (oriSelector, system) =>
  (state, ...args) => {
    const isOAS31 = system.specSelectors.isOAS31()
    return isOAS31 || oriSelector(...args)
  }

export const selectLicenseUrl =
  (oriSelector, system) =>
  (state, ...args) => {
    if (system.specSelectors.isOAS31()) {
      return system.oas31Selectors.selectLicenseUrl()
    }

    return oriSelector(...args)
  }
