import { fromJS } from "immutable"
// taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&") // $& means the whole matched string
}
/* eslint-disable camelcase */

export const advancedFilterMatcher_definitions = (spec, options, phrase, { fn, specSelectors }) => {
  const isOAS3 = specSelectors.isOAS3()
  const { schemaPathBase } = fn.schemaPathBase(specSelectors)

  const partialSpecResult = fromJS(isOAS3
    ? { components: { schemas: {} } }
    : { definitions: {} })

  const expr = fn.getRegularFilterExpr(options, escapeRegExp(phrase))
  if (expr) {
    const filteredSchemas = spec
      .getIn(schemaPathBase)
      .filter((schema, name) => expr.test(schema.get("title") || name))

    return partialSpecResult
      .setIn(schemaPathBase, filteredSchemas)
  }
  return partialSpecResult
}
