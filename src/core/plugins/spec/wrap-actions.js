import get from "lodash/get"
import isPlainObject from "lodash/isPlainObject"

export const updateSpec = (ori, {specActions}) => (...args) => {
  ori(...args)
  specActions.parseToJson(...args)
}

export const updateJsonSpec = (ori, {specActions}) => (...args) => {
  ori(...args)

  specActions.invalidateResolvedSubtreeCache()

  // Trigger resolution of any path-level $refs.
  const [json] = args
  const pathItems = get(json, ["paths"]) || {}
  const pathItemKeys = Object.keys(pathItems)

  pathItemKeys.forEach(k => {
    const val = get(pathItems, [k])

    if (isPlainObject(val) && val.$ref) {
      specActions.requestResolvedSubtree(["paths", k])
    }
  })

  // Trigger resolution of any securitySchemes-level $refs.
  specActions.requestResolvedSubtree(["components", "securitySchemes"])
}

// Log the request ( just for debugging, shouldn't affect prod )
export const executeRequest = (ori, { specActions }) => (req) => {
  specActions.logRequest(req)
  return ori(req)
}

export const validateParams = (ori, { specSelectors }) => (req) => {
  return ori(req, specSelectors.isOAS3())
}
