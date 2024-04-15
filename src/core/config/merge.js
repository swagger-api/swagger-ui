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
  const sourcesWithoutDomNode = []

  for (const source of sources) {
    if (Object.hasOwn(source, "domNode")) {
      domNode = source.domNode
      const sourceWithoutDomNode = { ...source }
      delete sourceWithoutDomNode.domNode
      sourcesWithoutDomNode.push(sourceWithoutDomNode)
    } else {
      sourcesWithoutDomNode.push(source)
    }
  }

  const merged = deepExtend(target, ...sourcesWithoutDomNode)

  if (domNode !== Symbol.for("domNode")) {
    merged.domNode = domNode
  }

  return merged
}

export default merge
