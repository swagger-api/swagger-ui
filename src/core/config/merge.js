/**
 * @prettier
 *
 * We're currently stuck with using deep-extend as it handles the following case:
 *
 * deepExtend({ a: 1 }, { a: undefined }) => { a: undefined }
 *
 * NOTE1: lodash.merge & lodash.mergeWith prefers to ignore undefined values
 * NOTE2: special handling of `domNode` option is now required as `deep-extend` will corrupt it (lodash.merge handles it correctly)
 * NOTE3: oauth2RedirectUrl and withCredentials options can be set to undefined. By expecting null instead of undefined, we can't use lodash.merge.
 *
 * TODO(vladimir.gorej@gmail.com): remove deep-extend in favor of lodash.merge
 */
import deepExtend from "deep-extend"

const merge = (target, ...sources) => {
  let domNode = Symbol.for("domNode")
  let primaryName = null
  const sourcesWithoutExceptions = []

  for (const source of sources) {
    const sourceWithoutExceptions = { ...source }

    if (Object.hasOwn(source, "domNode")) {
      domNode = source.domNode
      delete sourceWithoutExceptions.domNode
    }

    if (source["urls.primaryName"]) {
      primaryName = source["urls.primaryName"]
      delete sourceWithoutExceptions["urls.primaryName"]
    } else if (source.urls && source.urls.primaryName) {
      primaryName = source.urls.primaryName
      delete sourceWithoutExceptions.urls.primaryName
    }

    sourcesWithoutExceptions.push(sourceWithoutExceptions)
  }

  const merged = deepExtend(target, ...sourcesWithoutExceptions)

  if (domNode !== Symbol.for("domNode")) {
    merged.domNode = domNode
  }

  if (primaryName) {
    merged.urls.primaryName = primaryName
  }

  return merged
}

export default merge
