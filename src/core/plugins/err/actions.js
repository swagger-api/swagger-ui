import serializeError from "serialize-error"

export const NEW_THROWN_ERR = "err_new_thrown_err"
export const NEW_THROWN_ERR_BATCH = "err_new_thrown_err_batch"
export const NEW_SPEC_ERR = "err_new_spec_err"
export const NEW_AUTH_ERR = "err_new_auth_err"
export const CLEAR = "err_clear"

export function newThrownErr(err, action) {
  return {
      type: NEW_THROWN_ERR,
      payload: { action, error: serializeError(err) }
  }
}

export function newThrownErrBatch(errors) {
  return {
      type: NEW_THROWN_ERR_BATCH,
      payload: errors
  }
}

export function newSpecErr(err) {
  return {
      type: NEW_SPEC_ERR,
      payload: err
  }
}

export function newAuthErr(err) {
  return {
    type: NEW_AUTH_ERR,
    payload: err
  }
}

export function clear(filter = {}) {
  // filter looks like: {type: 'spec'}, {source: 'parser'}
  return {
    type: CLEAR,
    payload: filter
  }
}
