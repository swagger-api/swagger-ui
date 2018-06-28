import serializeError from "serialize-error"

export const NEW_THROWN_ERR = "err_new_thrown_err"
export const NEW_THROWN_ERR_BATCH = "err_new_thrown_err_batch"
export const NEW_SPEC_ERR = "err_new_spec_err"
export const NEW_SPEC_ERR_BATCH = "err_new_spec_err_batch"
export const NEW_AUTH_ERR = "err_new_auth_err"
export const CLEAR = "err_clear"
export const CLEAR_BY = "err_clear_by"

export function newThrownErr(err) {
  return {
      type: NEW_THROWN_ERR,
      payload: serializeError(err)
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

export function newSpecErrBatch(errArray) {
  return {
      type: NEW_SPEC_ERR_BATCH,
      payload: errArray
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

export function clearBy(filter = () => true) {
  // filter is a function
  return {
    type: CLEAR_BY,
    payload: filter
  }
}
