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
