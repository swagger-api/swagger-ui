import { taggedOperations } from "../../spec/selectors"
import { OrderedMap } from "immutable"

export const hierarchicalTaggedOperations = (state) => (system) => {
  system = system.getSystem()
  const delimiter = system.hierarchicalTagsSelectors.getTagDelimiter()
  const filter = system.layoutSelectors.currentFilter()

  let taggedOperationsMap = taggedOperations(state)(system)

  if (filter) {
    if (filter !== true && filter !== "true" && filter !== "false") {
      taggedOperationsMap = system.fn.opsFilter(taggedOperationsMap, filter)
    }
  }

  let hierarchicalTaggedOperations = OrderedMap()

  const addTagIn = (nestedTagPath, value) => {
    value = value.set("tags", OrderedMap())
    const visitedTags = []
    let currentTag = nestedTagPath.shift()
    while(currentTag !== undefined) {
      const isRootTag = visitedTags.length === 0
      const isNewRootTag = isRootTag && !hierarchicalTaggedOperations.has(currentTag)

      if(isNewRootTag) {
        hierarchicalTaggedOperations = hierarchicalTaggedOperations.set(
          currentTag,
          value
        )
        visitedTags.push(currentTag)
        currentTag = nestedTagPath.shift()
        continue
      }

      const hierarchicalUpdatePath = visitedTags
        .reduce((acc, x) => acc.concat([x, "tags"]), [])
      hierarchicalUpdatePath.push(currentTag)

      hierarchicalTaggedOperations = hierarchicalTaggedOperations.mergeDeepIn(
        hierarchicalUpdatePath,
        nestedTagPath.length === 0 ? value : OrderedMap({tags: OrderedMap()})
      )

      visitedTags.push(currentTag)
      currentTag = nestedTagPath.shift()
    }
  }

  taggedOperationsMap.forEach((v, k) => {
    addTagIn(k.split(delimiter), v)
  })
  return hierarchicalTaggedOperations
}
