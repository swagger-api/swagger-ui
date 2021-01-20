import { applyMatchersToSpec } from "./apply-matchers"
/* eslint-disable camelcase */
import { advancedFilterMatcher_operations, getMatchedOperationsSpec } from "./matchers/operation-matcher"
import { advancedFilterMatcher_tags } from "./matchers/tag-matcher"
import { advancedFilterMatcher_definitions } from "./matchers/definition-matcher"
import { getRegularFilterExpr } from "./regular-filter-expr"
import { schemaPathBase } from "./helper/schema-path-base"
import { extractSchema, extractSchemasFromOperations } from "./helper/extract-schemas"
import { extractTagsFromOperations } from "./helper/extract-tags"

export default {
  advancedFilterMatcher_operations,
  advancedFilterMatcher_tags,
  advancedFilterMatcher_definitions,
  applyMatchersToSpec,
  getRegularFilterExpr,
  schemaPathBase,
  extractSchema,
  extractSchemasFromOperations,
  extractTagsFromOperations,
  getMatchedOperationsSpec,
}
