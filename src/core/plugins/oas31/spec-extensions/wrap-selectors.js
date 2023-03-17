/**
 * @prettier
 */
import { onlyOAS31Wrap } from "../helpers"

export const isOAS3 =
  (oriSelector, system) =>
  (state, ...args) => {
    const isOAS31 = system.specSelectors.isOAS31()
    return isOAS31 || oriSelector(...args)
  }

export const selectLicenseUrl = onlyOAS31Wrap(() => (system) => {
  return system.oas31Selectors.selectLicenseUrl()
})
