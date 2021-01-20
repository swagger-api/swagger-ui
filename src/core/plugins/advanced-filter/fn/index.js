import { applyMatchersToSpec } from "./apply-matchers"
/* eslint-disable camelcase */
import { advancedFilterMatcher_operations } from "./matchers/operation-matcher"
import { advancedFilterMatcher_tags } from "./matchers/tag-matcher"
import { advancedFilterMatcher_definitions } from "./matchers/definition-matcher"

export default {
  advancedFilterMatcher_operations,
  advancedFilterMatcher_tags,
  advancedFilterMatcher_definitions,
  applyMatchersToSpec,
}
