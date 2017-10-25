export const updateSpec = (ori, {specActions}) => (...args) => {
  ori(...args)
  specActions.parseToJson(...args)
}

export const updateJsonSpec = (ori, {specActions}) => (...args) => {
  ori(...args)
  specActions.resolveSpec(...args)
}

// Log the request ( just for debugging, shouldn't affect prod )
export const executeRequest = (ori, { specActions }) => (req) => {
  specActions.logRequest(req)
  return ori(req)
}

export const validateParams = (ori, { specSelectors }) => (req) => {
  return ori(req, specSelectors.isOAS3())
}