import { OrderedMap } from "immutable"


const addTagIn = (hierarchicalOperations, nestedTagPath, targetValue) => {
  targetValue = targetValue.set("childTags", OrderedMap())
  for (let i = 0; i < nestedTagPath.length; i++) {
    const currentTag = nestedTagPath[i]
    const isTargetTag = i === nestedTagPath.length - 1
    const isRootTag = i === 0
    const isNewRootTag = isRootTag && !hierarchicalOperations.has(currentTag)

    const newTagValue = isTargetTag ? targetValue : OrderedMap({childTags: OrderedMap()})

    if(isNewRootTag) {
      hierarchicalOperations = hierarchicalOperations.set(
        currentTag,
        newTagValue
      )
      continue
    }

    const hierarchicalUpdatePath = nestedTagPath
      .slice(0, i)
      .reduce((acc, x) => acc.concat([x, "childTags"]), [])
    hierarchicalUpdatePath.push(currentTag)

    hierarchicalOperations = hierarchicalOperations.mergeDeepIn(
      hierarchicalUpdatePath,
      newTagValue
    )
  }
  return hierarchicalOperations
}

export const taggedOperations = (oriSelector, system) => (state, ...args) => {
  let taggedOps = oriSelector(state, ...args)

  const { fn, layoutSelectors, getConfigs } = system.getSystem()
  const configs = getConfigs()
  const { maxDisplayedTags, hierarchicalTags } = configs

  // Filter, if requested
  let filter = layoutSelectors.currentFilter()
  if (filter) {
    if (filter !== true && filter !== "true" && filter !== "false") {
      taggedOps = fn.opsFilter(taggedOps, filter)
    }
  }
  // Limit to [max] items, if specified
  if (maxDisplayedTags && !isNaN(maxDisplayedTags) && maxDisplayedTags >= 0) {
    taggedOps = taggedOps.slice(0, maxDisplayedTags)
  }

  if(hierarchicalTags === true || hierarchicalTags === "true") {
    const tagSplitterChar = configs.tagSplitterChar || /[:|]/

    return taggedOps.reduce(
      (hierarchicalOperations, tagObj, tagName) => addTagIn(hierarchicalOperations, tagName.split(tagSplitterChar), tagObj),
      OrderedMap()
    )
  }

  return taggedOps
}
