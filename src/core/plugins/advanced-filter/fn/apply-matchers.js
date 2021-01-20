import assignDeep from "@kyleshockey/object-assign-deep"
import { isFunc } from "../../../utils"
import { fromJS } from "immutable"

export const applyMatchersToSpec = (phrase, system) => {
  system = system.getSystem()
  const spec = system.specSelectors.specJsonWithResolvedSubtrees()
  const matchers = system.advancedFilterSelectors.getActiveMatchers()
  const options = system.advancedFilterSelectors.getMatcherOptions()
  const filteredSpecs = matchers
    .keySeq()
    .toArray()
    .map(key => system.fn[`advancedFilterMatcher_${key}`](spec, options, phrase, system))
  const mergedFilteredSpecs = assignDeep({}, ...filteredSpecs.map(spec => !spec
    ? {}
    : isFunc(spec.toJS)
      ? spec.toJS()
      : spec)
  )
  return fromJS(mergedFilteredSpecs)
}
