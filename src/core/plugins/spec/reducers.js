import { fromJS, List } from "immutable"
import { fromJSOrdered, validateParam, paramToValue, paramToIdentifier } from "core/utils"
import win from "core/window"

// selector-in-reducer is suboptimal, but `operationWithMeta` is more of a helper
import {
  specJsonWithResolvedSubtrees,
  parameterValues,
  parameterInclusionSettingFor,
} from "./selectors"

import {
  UPDATE_SPEC,
  UPDATE_URL,
  UPDATE_JSON,
  UPDATE_PARAM,
  UPDATE_EMPTY_PARAM_INCLUSION,
  VALIDATE_PARAMS,
  SET_RESPONSE,
  SET_REQUEST,
  SET_MUTATED_REQUEST,
  UPDATE_RESOLVED,
  UPDATE_RESOLVED_SUBTREE,
  UPDATE_OPERATION_META_VALUE,
  CLEAR_RESPONSE,
  CLEAR_REQUEST,
  CLEAR_VALIDATE_PARAMS,
  SET_SCHEME
} from "./actions"

export default {

  [UPDATE_SPEC]: (state, action) => {
    return (typeof action.payload === "string")
      ? state.set("spec", action.payload)
      : state
  },

  [UPDATE_URL]: (state, action) => {
    return state.set("url", action.payload+"")
  },

  [UPDATE_JSON]: (state, action) => {
    return state.set("json", fromJSOrdered(action.payload))
  },

  [UPDATE_RESOLVED]: (state, action) => {
    return state.setIn(["resolved"], fromJSOrdered(action.payload))
  },

  [UPDATE_RESOLVED_SUBTREE]: (state, action) => {
    const { value, path } = action.payload
    return state.setIn(["resolvedSubtrees", ...path], fromJSOrdered(value))
  },

  [UPDATE_PARAM]: ( state, {payload} ) => {
    let { path: pathMethod, paramName, paramIn, param, value, isXml } = payload

    let paramKey = param ? paramToIdentifier(param) : `${paramIn}.${paramName}`

    const valueKey = isXml ? "value_xml" : "value"

    return state.setIn(
      ["meta", "paths", ...pathMethod, "parameters", paramKey, valueKey],
      fromJS(value)
    )
  },

  [UPDATE_EMPTY_PARAM_INCLUSION]: ( state, {payload} ) => {
    let { pathMethod, paramName, paramIn, includeEmptyValue } = payload

    if(!paramName || !paramIn) {
      console.warn("Warning: UPDATE_EMPTY_PARAM_INCLUSION could not generate a paramKey.")
      return state
    }

    const paramKey = `${paramIn}.${paramName}`

    return state.setIn(
      ["meta", "paths", ...pathMethod, "parameter_inclusions", paramKey],
      includeEmptyValue
    )
  },

  [VALIDATE_PARAMS]: ( state, { payload: { pathMethod, isOAS3 } } ) => {
    const op = specJsonWithResolvedSubtrees(state).getIn(["paths", ...pathMethod])
    const paramValues = parameterValues(state, pathMethod).toJS()

    return state.updateIn(["meta", "paths", ...pathMethod, "parameters"], fromJS({}), paramMeta => {
      return op.get("parameters", List()).reduce((res, param) => {
        const value = paramToValue(param, paramValues)
        const isEmptyValueIncluded = parameterInclusionSettingFor(state, pathMethod, param.get("name"), param.get("in"))
        const errors = validateParam(param, value, {
          bypassRequiredCheck: isEmptyValueIncluded,
          isOAS3,
        })
        return res.setIn([paramToIdentifier(param), "errors"], fromJS(errors))
      }, paramMeta)
    })
  },
  [CLEAR_VALIDATE_PARAMS]: ( state, { payload:  { pathMethod } } ) => {
    return state.updateIn( [ "meta", "paths", ...pathMethod, "parameters" ], fromJS([]), parameters => {
      return parameters.map(param => param.set("errors", fromJS([])))
    })
  },

  [SET_RESPONSE]: (state, { payload: { res, path, method } } ) =>{
    let result
    if ( res.error ) {
      result = Object.assign({
        error: true,
        name: res.err.name,
        message: res.err.message,
        statusCode: res.err.statusCode
      }, res.err.response)
    } else {
      result = res
    }

    // Ensure headers
    result.headers = result.headers || {}

    let newState = state.setIn( [ "responses", path, method ], fromJSOrdered(result) )

    // ImmutableJS messes up Blob. Needs to reset its value.
    if (win.Blob && result.data instanceof win.Blob) {
      newState = newState.setIn( [ "responses", path, method, "text" ], result.data)
    }
    return newState
  },

  [SET_REQUEST]: (state, { payload: { req, path, method } } ) =>{
    return state.setIn( [ "requests", path, method ], fromJSOrdered(req))
  },

  [SET_MUTATED_REQUEST]: (state, { payload: { req, path, method } } ) =>{
    return state.setIn( [ "mutatedRequests", path, method ], fromJSOrdered(req))
  },

  [UPDATE_OPERATION_META_VALUE]: (state, { payload: { path, value, key } }) => {
    // path is a pathMethod tuple... can't change the name now.
    let operationPath = ["paths", ...path]
    let metaPath = ["meta", "paths", ...path]

    if(
      !state.getIn(["json", ...operationPath])
      && !state.getIn(["resolved", ...operationPath])
      && !state.getIn(["resolvedSubtrees", ...operationPath])
    ) {
      // do nothing if the operation does not exist
      return state
    }

    return state.setIn([...metaPath, key], fromJS(value))
  },

  [CLEAR_RESPONSE]: (state, { payload: { path, method } } ) =>{
    return state.deleteIn( [ "responses", path, method ])
  },

  [CLEAR_REQUEST]: (state, { payload: { path, method } } ) =>{
    return state.deleteIn( [ "requests", path, method ])
  },

  [SET_SCHEME]: (state, { payload: { scheme, path, method } } ) =>{
    if ( path && method ) {
      return state.setIn( [ "scheme", path, method ], scheme)
    }

    if (!path && !method) {
      return state.setIn( [ "scheme", "_defaultScheme" ], scheme)
    }

  }

}
