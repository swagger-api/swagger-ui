import {
  UPDATE_SELECTED_SERVER,
  UPDATE_REQUEST_BODY_VALUE,
  UPDATE_REQUEST_CONTENT_TYPE,
  UPDATE_SERVER_VARIABLE_VALUE,
  UPDATE_RESPONSE_CONTENT_TYPE
} from "./actions"

export default {
  [UPDATE_SELECTED_SERVER]: (state, { payload: selectedServerUrl } ) =>{
    return state.setIn( [ "selectedServer" ], selectedServerUrl)
  },
  [UPDATE_REQUEST_BODY_VALUE]: (state, { payload: { value, pathMethod } } ) =>{
    let [path, method] = pathMethod
    return state.setIn( [ "requestData", path, method, "bodyValue" ], value)
  },
  [UPDATE_REQUEST_CONTENT_TYPE]: (state, { payload: { value, pathMethod } } ) =>{
    let [path, method] = pathMethod
    return state.setIn( [ "requestData", path, method, "requestContentType" ], value)
  },
  [UPDATE_RESPONSE_CONTENT_TYPE]: (state, { payload: { value, pathMethod } } ) =>{
    let [path, method] = pathMethod
    return state.setIn( [ "requestData", path, method, "responseContentType" ], value)
  },
  [UPDATE_SERVER_VARIABLE_VALUE]: (state, { payload: { server, key, val } } ) =>{
    return state.setIn( [ "serverVariableValues", server, key ], val)
  },
}
