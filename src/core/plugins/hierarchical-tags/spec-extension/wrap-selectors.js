export const taggedOperations = (oriSelector, system) => (...args) => {
  const { hierarchicalTagsSelectors, specSelectors } = system.getSystem()
  if(!hierarchicalTagsSelectors.isEnabled()) {
    return oriSelector(...args)
  }

  return specSelectors.hierarchicalTaggedOperations()
}
