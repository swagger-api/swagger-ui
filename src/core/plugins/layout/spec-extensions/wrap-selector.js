
export const taggedOperations = (oriSelector, system) => (state, ...args) => {
  let taggedOps = oriSelector(state, ...args)

  const { fn, layoutSelectors, getConfigs } = system.getSystem()
  const configs = getConfigs()
  const { maxDisplayedTags } = configs

  // Filter, if requested
  let filter = layoutSelectors.currentFilter()
  if (filter) {
    if (filter !== true) {
      taggedOps = fn.opsFilter(taggedOps, filter)
    }
  }
  // Limit to [max] items, if specified
  if (maxDisplayedTags >= 0) {
    taggedOps = taggedOps.slice(0, maxDisplayedTags)
  }

  return taggedOps
}
