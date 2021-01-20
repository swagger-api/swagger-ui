/* eslint-disable no-useless-escape */

import { List, Map, Set } from "immutable"

const getNameMatcher = ({ fn, specSelectors }) => {
  const { schemaPathBaseRegex } = fn.schemaPathBase(specSelectors)
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
