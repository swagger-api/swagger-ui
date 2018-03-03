import {
  NEW_THROWN_ERR,
  NEW_THROWN_ERR_BATCH,
  NEW_SPEC_ERR,
  NEW_SPEC_ERR_BATCH,
  NEW_AUTH_ERR,
  CLEAR,
  CLEAR_BY,
} from "./actions"

import { fromJS, List } from "immutable"

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

    [NEW_SPEC_ERR_BATCH]: (state, { payload }) => {
      payload = payload.map(err => {
        return fromJS(Object.assign(DEFAULT_ERROR_STRUCTURE, err, { type: "spec" }))
      })
      return state
      .update("errors", errors => (errors || List()).concat( fromJS( payload )) )
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
      if(!payload || !state.get("errors")) {
        return state
      }

      let newErrors = state.get("errors")
        .filter(err => {
          return err.keySeq().every(k => {
            const errValue = err.get(k)
            const filterValue = payload[k]

            if(!filterValue) return true

            return errValue !== filterValue
          })
        })
      return state.merge({
        errors: newErrors
      })
    },

    [CLEAR_BY]: (state, { payload }) => {
      if(!payload || typeof payload !== "function") {
        return state
      }
      let newErrors = state.get("errors")
        .filter(err => {
          return payload(err)
        })
      return state.merge({
        errors: newErrors
      })
    }
  }
}
