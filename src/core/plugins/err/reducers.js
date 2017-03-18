import {
  NEW_THROWN_ERR,
  NEW_THROWN_ERR_BATCH,
  NEW_SPEC_ERR,
  NEW_AUTH_ERR,
  CLEAR
} from "./actions"

import reject from "lodash/reject"

import Im, { fromJS, List } from "immutable"

import transformErrors from "./error-transformers/hook"

let DEFAULT_ERROR_STRUCTURE = {
  // defaults
  line: 0,
  level: "error",
  message: "Unknown error"
}

export default function(system) {
  return {
    [NEW_THROWN_ERR]: (state, { payload }) => {
      let error = Object.assign(DEFAULT_ERROR_STRUCTURE, payload, {type: "thrown"})
      return state
        .update("errors", errors => (errors || List()).push( fromJS( error )) )
        .update("errors", errors => transformErrors(errors, system.getSystem()))
    },

    [NEW_THROWN_ERR_BATCH]: (state, { payload }) => {
      payload = payload.map(err => {
        return fromJS(Object.assign(DEFAULT_ERROR_STRUCTURE, err, { type: "thrown" }))
      })
      return state
        .update("errors", errors => (errors || List()).concat( fromJS( payload )) )
        .update("errors", errors => transformErrors(errors, system.getSystem()))
    },

    [NEW_SPEC_ERR]: (state, { payload }) => {
      let error = fromJS(payload)
      error = error.set("type", "spec")
      return state
        .update("errors", errors => (errors || List()).push( fromJS(error)).sortBy(err => err.get("line")) )
        .update("errors", errors => transformErrors(errors, system.getSystem()))
    },

    [NEW_AUTH_ERR]: (state, { payload }) => {
      let error = fromJS(Object.assign({}, payload))

      error = error.set("type", "auth")
      return state
        .update("errors", errors => (errors || List()).push( fromJS(error)) )
        .update("errors", errors => transformErrors(errors, system.getSystem()))
    },

    [CLEAR]: (state, { payload }) => {
      if(!payload) {
        return
      }
      // TODO: Rework, to use immutable only, no need for lodash
      let newErrors = Im.fromJS(reject((state.get("errors") || List()).toJS(), payload))
      return state.merge({
        errors: newErrors
      })
    }
  }
}
