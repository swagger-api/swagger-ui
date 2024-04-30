/**
 * @prettier
 *
 * We're currently stuck with using deep-extend as it handles the following case:
 *
 * deepExtend({ a: 1 }, { a: undefined }) => { a: undefined }
 *
 * NOTE1: lodash.merge & lodash.mergeWith prefers to ignore undefined values
 * NOTE2: special handling of `domNode` option is now required as `deep-extend` will corrupt it (lodash.merge handles it correctly)
 * NOTE3: oauth2RedirectUrl option can be set to undefined. By expecting null instead of undefined, we can't use lodash.merge.
 * NOTE4: urls.primaryName needs to handled in special way, because it's an arbitrary property on Array instance
 *
 * TODO(vladimir.gorej@gmail.com): remove deep-extend in favor of lodash.merge
 */
import deepExtend from "deep-extend"
import typeCast from "./type-cast"

const merge = (target, ...sources) => {
  let domNode = Symbol.for("domNode")
  let primaryName = Symbol.for("primaryName")
  const sourcesWithoutExceptions = []

  for (const source of sources) {
    const sourceWithoutExceptions = { ...source }

    if (Object.hasOwn(sourceWithoutExceptions, "domNode")) {
      domNode = sourceWithoutExceptions.domNode
      delete sourceWithoutExceptions.domNode
    }

    if (Object.hasOwn(sourceWithoutExceptions, "urls.primaryName")) {
      primaryName = sourceWithoutExceptions["urls.primaryName"]
      delete sourceWithoutExceptions["urls.primaryName"]
    } else if (
      Array.isArray(sourceWithoutExceptions.urls) &&
      Object.hasOwn(sourceWithoutExceptions.urls, "primaryName")
    ) {
      primaryName = sourceWithoutExceptions.urls.primaryName
      delete sourceWithoutExceptions.urls.primaryName
    }

    sourcesWithoutExceptions.push(sourceWithoutExceptions)
  }

  const merged = deepExtend(target, ...sourcesWithoutExceptions)

  if (domNode !== Symbol.for("domNode")) {
    merged.domNode = domNode
  }

  if (primaryName !== Symbol.for("primaryName") && Array.isArray(merged.urls)) {
    merged.urls.primaryName = primaryName
  }

  return typeCast(merged)
}

export default merge
