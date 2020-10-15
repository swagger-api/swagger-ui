import { fromJS, Map } from "immutable"

import {
  UPDATE_SELECTED_SERVER,
  UPDATE_REQUEST_BODY_VALUE,
  UPDATE_REQUEST_BODY_INCLUSION,
  UPDATE_ACTIVE_EXAMPLES_MEMBER,
  UPDATE_REQUEST_CONTENT_TYPE,
  UPDATE_SERVER_VARIABLE_VALUE,
  UPDATE_RESPONSE_CONTENT_TYPE,
  SET_REQUEST_BODY_VALIDATE_ERROR,
  CLEAR_REQUEST_BODY_VALIDATE_ERROR,
  CLEAR_REQUEST_BODY_VALUE,
} from "./actions"

export default {
  [UPDATE_SELECTED_SERVER]: (state, { payload: { selectedServerUrl, namespace } } ) =>{
    const path = namespace ? [ namespace, "selectedServer"] : [ "selectedServer"]
    return state.setIn( path, selectedServerUrl)
  },
  [UPDATE_REQUEST_BODY_VALUE]: (state, { payload: { value, pathMethod } } ) =>{
    let [path, method] = pathMethod
    if (!Map.isMap(value)) {
      // context: application/json is always a String (instead of Map)
      return state.setIn( [ "requestData", path, method, "bodyValue" ], value)
    }
    let currentVal = state.getIn(["requestData", path, method, "bodyValue"]) || Map()
    if (!Map.isMap(currentVal)) {
      // context: user switch from application/json to application/x-www-form-urlencoded
      currentVal = Map()
    }
    let newVal
    const [...valueKeys] = value.keys()
    valueKeys.forEach((valueKey) => {
      let valueKeyVal = value.getIn([valueKey])
      if (!currentVal.has(valueKey)) {
        newVal = currentVal.setIn([valueKey, "value"], valueKeyVal)
      } else if (!Map.isMap(valueKeyVal)) {
        // context: user input will be received as String
        newVal = currentVal.setIn([valueKey, "value"], valueKeyVal)
      }
    })
    return state.setIn(["requestData", path, method, "bodyValue"], newVal)
  },
  [UPDATE_REQUEST_BODY_INCLUSION]: (state, { payload: { value, pathMethod, name } } ) =>{
    let [path, method] = pathMethod
    return state.setIn( [ "requestData", path, method, "bodyInclusion", name ], value)
  },
  [UPDATE_ACTIVE_EXAMPLES_MEMBER]: (state, { payload: { name, pathMethod, contextType, contextName } } ) =>{
    let [path, method] = pathMethod
    return state.setIn( [ "examples", path, method, contextType, contextName, "activeExample" ], name)
  },
  [UPDATE_REQUEST_CONTENT_TYPE]: (state, { payload: { value, pathMethod } } ) =>{
    let [path, method] = pathMethod
    return state.setIn( [ "requestData", path, method, "requestContentType" ], value)
  },
  [UPDATE_RESPONSE_CONTENT_TYPE]: (state, { payload: { value, path, method } } ) =>{
    return state.setIn( [ "requestData", path, method, "responseContentType" ], value)
  },
  [UPDATE_SERVER_VARIABLE_VALUE]: (state, { payload: { server, namespace, key, val } } ) =>{
    const path = namespace ? [ namespace, "serverVariableValues", server, key ] : [ "serverVariableValues", server, key ]
    return state.setIn(path, val)
  },
  [SET_REQUEST_BODY_VALIDATE_ERROR]: (state, { payload: { path, method, validationErrors } } ) => {
    let errors = []
    errors.push("Required field is not provided")
    if (validationErrors.missingBodyValue) {
      // context: is application/json or application/xml, where typeof (missing) bodyValue = String
      return state.setIn(["requestData", path, method, "errors"], fromJS(errors))
    }
    if (validationErrors.missingRequiredKeys && validationErrors.missingRequiredKeys.length > 0) {
      // context: is application/x-www-form-urlencoded, with list of missing keys
      const { missingRequiredKeys } = validationErrors
      return state.updateIn(["requestData", path, method, "bodyValue"], fromJS({}), missingKeyValues => {
        return missingRequiredKeys.reduce((bodyValue, currentMissingKey) => {
          return bodyValue.setIn([currentMissingKey, "errors"], fromJS(errors))
        }, missingKeyValues)
      })
    }
    console.warn("unexpected result: SET_REQUEST_BODY_VALIDATE_ERROR")
    return state
  },
  [CLEAR_REQUEST_BODY_VALIDATE_ERROR]: (state, { payload: { path, method } }) => {
    const requestBodyValue = state.getIn(["requestData", path, method, "bodyValue"])
    if (!Map.isMap(requestBodyValue)) {
      return state.setIn(["requestData", path, method, "errors"], fromJS([]))
    }
    const [...valueKeys] = requestBodyValue.keys()
    if (!valueKeys) {
      return state
    }
    return state.updateIn(["requestData", path, method, "bodyValue"], fromJS({}), bodyValues => {
      return valueKeys.reduce((bodyValue, curr) => {
        return bodyValue.setIn([curr, "errors"], fromJS([]))
      }, bodyValues)
    })
  },
  [CLEAR_REQUEST_BODY_VALUE]: (state, { payload: { pathMethod }}) => {
    let [path, method] = pathMethod
    const requestBodyValue = state.getIn(["requestData", path, method, "bodyValue"])
    if (!requestBodyValue) {
      return state
    }
    if (!Map.isMap(requestBodyValue)) {
      return state.setIn(["requestData", path, method, "bodyValue"], "")
    }
    return state.setIn(["requestData", path, method, "bodyValue"], Map())
  }
}
