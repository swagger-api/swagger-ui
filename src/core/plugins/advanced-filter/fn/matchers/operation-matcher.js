import { fromJS, Map } from "immutable"
// taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&") // $& means the whole matched string
}
/* eslint-disable camelcase */
export const getMatchedOperationsSpec = (operationFilterPredicate, spec, options, phrase, { fn, specSelectors, getSystem }) => {
  const system = getSystem()
  const isOAS3 = specSelectors.isOAS3()
  const { schemaPathBase } = fn.schemaPathBase(specSelectors)
  const partialSpecResult = fromJS(isOAS3
    ? { paths: {}, tags: [], components: { schemas: {} } }
    : { paths: {}, tags: [], definitions: {} })

  const filteredPaths = operationFilterPredicate(spec.get("paths") || Map())
  const filteredTags = fn.extractTagsFromOperations(filteredPaths)
  let schemaNamesForOperations = fn.extractSchemasFromOperations(filteredPaths, system)
  const filteredOperationSchemas = spec
    .getIn(schemaPathBase)
    .filter((schema, name) => schemaNamesForOperations.includes(name))
  return partialSpecResult
    .set("paths", filteredPaths)
    .set("tags", filteredTags)
    .setIn(schemaPathBase, filteredOperationSchemas)
}
export const advancedFilterMatcher_operations = (spec, options, phrase, { getSystem }) => {
  const system = getSystem()
  const expr = system.fn.getRegularFilterExpr(options, escapeRegExp(phrase))
  if (expr) {
    return system.fn.getMatchedOperationsSpec(
      (ops) => ops.filter((path, pathName) => expr.test(pathName)),
      spec, options, phrase, system,
    )
  }
}
