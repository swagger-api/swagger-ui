export const isOAS3 = (oriSelector, system) => (state, ...args) => {
  const isOAS31 = system.specSelectors.isOAS31()
  return isOAS31 || oriSelector(...args)
}
