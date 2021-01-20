import { fromJS, List, Map, Set } from "immutable"
// taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&") // $& means the whole matched string
}
/* eslint-disable camelcase */
/* eslint-disable no-useless-escape */

export const advancedFilterMatcher_operations = (spec, options, phrase, {specSelectors}) => {
  const isOAS3 = specSelectors.isOAS3()
  const schemaPathBaseRegex = isOAS3
    ? "\\/components\\/schemas\\/"
    : "\\/definitions\\/"
  const schemaPathBase = isOAS3
    ? ["components", "schemas"]
    : ["definitions"]
  const partialSpecResult = fromJS(isOAS3
    ? { paths: {}, tags: [], components: { schemas: {}}}
    : { paths: {}, tags: [], definitions: {}})
  const nameMatcher = new RegExp(`(?<=${schemaPathBaseRegex}).*?(?=(?=\/)|$)`)

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
    const filteredPaths = (spec.get("paths") || Map())
      .filter((path, pathName) => expr.test(pathName))
    const filteredTags = filteredPaths
      .flatMap(method => method.map(op => op.get("tags")))
    let schemaNamesForOperations = Set()
    filteredPaths.forEach((path) => {
      path.forEach(op => {
        schemaNamesForOperations = schemaNamesForOperations
          .union(op
            .getIn(["requestBody", "content"], Map())
            .map(v => v.getIn(["schema", "$ref"], v.getIn(["schema", "items", "$ref"])))
            .filter(ref => ref != null)
            .valueSeq()
            .toSet()
            .map(requestBodyRef => {
              const nameMatch = nameMatcher.exec(requestBodyRef)
              return nameMatch ? nameMatch[0] : nameMatch
            })
            .filter(name => name != null),
          )
          .union(op
            .getIn(["parameters"], List())
            .filter(param => param.get("in") === "body")
            .map(v => v.getIn(["schema", "$ref"], v.getIn(["schema", "items", "$ref"])))
            .filter(ref => ref != null)
            .valueSeq()
            .toSet()
            .map(requestBodyRef => {
              const nameMatch = nameMatcher.exec(requestBodyRef)
              return nameMatch ? nameMatch[0] : nameMatch
            })
            .filter(name => name != null),
          )
          .union(op
            .getIn(["responses"], Map())
            .map(v => isOAS3 ? v.get("content") : v)
            .filter(content => content != null)
            .map(content => content.getIn(["schema", "$ref"], content.getIn(["schema", "items", "$ref"])))
            .filter(ref => ref != null)
            .valueSeq()
            .toSet()
            .map(requestBodyRef => {
              const nameMatch = nameMatcher.exec(requestBodyRef)
              return nameMatch ? nameMatch[0] : nameMatch
            })
            .filter(name => name != null),
          )
      })
    })
    const filteredOperationSchemas = spec
      .getIn(schemaPathBase)
      .filter((schema, name) => schemaNamesForOperations.includes(name))
    return partialSpecResult
      .set("paths", filteredPaths)
      .set("tags", filteredTags)
      .setIn(schemaPathBase, filteredOperationSchemas)
  }
  return partialSpecResult
}
