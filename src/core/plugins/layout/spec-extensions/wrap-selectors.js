import { fromJS } from "immutable"

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

  if(hierarchicalTags) {
    const tagSplitterChar = configs.tagSplitterChar || /[:|]/
    // If the `hierarchicalTags` option is set, we want to break down the tags into a deep
    // hierarchy. We're using a "raw" object for cleanliness here, but later we'll convert that
    // into an immutable map. Here are the types we're dealing with:
    //
    // const operationTagsRaw: TagMap;
    // type TagMap = { [TagName: string]: TagData };
    // type TagData = {
    //   canonicalName: string;
    //   data: TagInfoAndOperations | null;
    //   childTags: TagMap;
    // }
    // TODO: Explicitly define TagInfoAndOperations

    const operationTagsRaw = {}

    // For each raw tag....
    taggedOps.map((tagObj, tagName) => {
      // Split the raw tag name into parts
      const parts = tagName.split(tagSplitterChar)

      // Set a pointer for use in traversing the hierarchy
      let current = operationTagsRaw

      // Iterate through the parts defined by this tag
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i]

        // If there's no object defined for the current part, define one with just childTags as an
        // empty set
        if (current[part] === undefined) {
          // Compose canonical name from parts up to this point
          const canonicalName = parts.reduce(
            (name, p, j) => ((j > i) ? name : name.concat([p])),
            []
          ).join("|")
          current[part] = {
            canonicalName,
            data: null,
            childTags: {}
          }
        }

        // If this is the last part, set data on this object
        if (i === parts.length - 1) {
          current[part].data = tagObj
        }

        // Move to the next level of the hierarchy before looping around
        current = current[part].childTags
      }
    })
    taggedOps = fromJS(operationTagsRaw)
  }

  return taggedOps
}
