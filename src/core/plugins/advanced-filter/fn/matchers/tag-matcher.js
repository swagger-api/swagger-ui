// taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&") // $& means the whole matched string
}
/* eslint-disable camelcase */

export const advancedFilterMatcher_tags = (spec, options, phrase, { getSystem }) => {
  const system = getSystem()
  const expr = system.fn.getRegularFilterExpr(options, escapeRegExp(phrase))
  if (expr) {
    return system.fn.getMatchedOperationsSpec(
      (ops) => ops.map(path => path
        .filter(op => op.get("tags").filter(tag => expr.test(tag)).count() > 0),
      ),
      spec, options, phrase, system,
    )
  }
}
