import { fromJS, List, Map, OrderedMap, Set } from "immutable"


const getNameMatcher = ({ fn, specSelectors }) => {
  const { schemaPathBaseRegex } = fn.schemaPathBase(specSelectors)
  // eslint-disable-next-line no-useless-escape
  return new RegExp(`(?<=${schemaPathBaseRegex}).*?(?=(?=\/)|$)`)
}

export const extractSchema = (schemaContainer, system) => {
  const nameMatcher = getNameMatcher(system)
  return schemaContainer
    .map(v => v.getIn(["schema", "$ref"], v.getIn(["schema", "items", "$ref"])))
    .filter(ref => ref != null)
    .valueSeq()
    .toSet()
    .map(requestBodyRef => {
      const nameMatch = nameMatcher.exec(requestBodyRef)
      return nameMatch ? nameMatch[0] : nameMatch
    })
    .filter(name => name != null)
}
export const extractSchemasFromOperations = (operations, system) => {
  const { fn, specSelectors } = system
  const isOAS3 = specSelectors.isOAS3()
  let schemaNamesForOperations = Set()
  operations.forEach((path) => {
    path.forEach(op => {
      schemaNamesForOperations = schemaNamesForOperations
        .union(fn.extractSchema(op.getIn(["requestBody", "content"], Map()), system))
        .union(fn.extractSchema(op
          .getIn(["parameters"], List())
          .filter(param => param.get("in") === "body"), system))
        .union(fn.extractSchema(op
          .getIn(["responses"], Map())
          .map(v => isOAS3 ? v.get("content") : v)
          .filter(content => content != null), system))
    })
  })
  return schemaNamesForOperations
}

export const extractTagsFromOperations = (operations) => {
  return operations
    .flatMap(method => method.map(op => op.get("tags")))
}

export const schemaPathBase = (specSelectors) => {
  const isOAS3 = specSelectors.isOAS3()
  const schemaPathBaseRegex = isOAS3
    ? "\\/components\\/schemas\\/"
    : "\\/definitions\\/"
  const schemaPathBase = isOAS3
    ? ["components", "schemas"]
    : ["definitions"]
  return { schemaPathBaseRegex, schemaPathBase }
}

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
export const getMatchedOperationsSpec = (operationFilterPredicate, spec, { fn, specSelectors, getSystem }) => {
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
      spec, system,
    )
  }
}

export const advancedFilterMatcher_tags = (spec, options, phrase, { getSystem }) => {
  const system = getSystem()
  const expr = system.fn.getRegularFilterExpr(options, escapeRegExp(phrase))
  if (expr) {
    return system.fn.getMatchedOperationsSpec(
      (ops) => ops.map(path => path
        .filter(op => op.get("tags").filter(tag => expr.test(tag)).count() > 0),
      ),
      spec, system,
    )
  }
}
/* eslint-enable camelcase */


export const applyMatchersToSpec = (phrase, system) => {
  system = system.getSystem()
  const spec = system.specSelectors.specJsonWithResolvedSubtrees()
  const matchers = system.advancedFilterSelectors.getActiveMatchers()
  const options = system.advancedFilterSelectors.getMatcherOptions()
  const filteredSpecs = matchers
    .keySeq()
    .toArray()
    .map(key => system.fn[`advancedFilterMatcher_${key}`](spec, options, phrase, system))
  return OrderedMap().mergeDeep(...filteredSpecs)
}

export const getRegularFilterExpr = (options, phrase) => {
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
  return expr
}
