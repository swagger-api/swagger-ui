import { fromJS } from "immutable"
// taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&") // $& means the whole matched string
}
/* eslint-disable camelcase */

export const advancedFilterMatcher_definitions = (spec, options, phrase, { specSelectors }) => {
  const isOAS3 = specSelectors.isOAS3()
  const schemaPathBase = isOAS3
    ? ["components", "schemas"]
    : ["definitions"]
  const partialSpecResult = fromJS(isOAS3
    ? { components: { schemas: {} } }
    : { definitions: {} })

  phrase = escapeRegExp(phrase)
  let expr
  try {
    expr = new RegExp(
      options.get("matchWholeWord")
        ? `\\b${phrase}\\b`
        : phrase,
      !options.get("matchCase") ? "i" : "",
    )
  } catch {
    // TODO: add errors to state
  }
  if (expr) {
    const filteredSchemas = spec
      .getIn(schemaPathBase)
      .filter((schema, name) => expr.test(schema.get("title") || name))

    return partialSpecResult
      .setIn(schemaPathBase, filteredSchemas)
  }
  return partialSpecResult
}
