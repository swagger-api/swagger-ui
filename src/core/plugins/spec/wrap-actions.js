import { delay } from "lodash"

export const updateSpec = (ori, {specActions}) => (...args) => {
  ori(...args)
  specActions.parseToJson(...args)
}

export const updateJsonSpec = (ori, {specActions}) => (...args) => {
  ori(...args)
  specActions.resolveSpec(...args)
}

// Wrap `updateResolved` so we can call `configs.onComplete` when a spec has loaded
export const updateResolved = (ori, {triggerOnComplete}) => (...args) => {
  ori(...args)
  // Ew a delay... our state is updated but we need to give the UI time to render
  delay( triggerOnComplete, 500 )
}

// Log the request ( just for debugging, shouldn't affect prod )
export const executeRequest = (ori, { specActions }) => (req) => {
  specActions.logRequest(req)
  return ori(req)
}
