import {
  UPDATE_SELECTED_SERVER,
  UPDATE_REQUEST_BODY_VALUE,
  UPDATE_ACTIVE_EXAMPLES_MEMBER,
  UPDATE_REQUEST_CONTENT_TYPE,
  UPDATE_SERVER_VARIABLE_VALUE,
  UPDATE_RESPONSE_CONTENT_TYPE
} from "./actions"

export default {
  [UPDATE_SELECTED_SERVER]: (state, { payload: { selectedServerUrl, namespace } } ) =>{
    const path = namespace ? [ namespace, "selectedServer"] : [ "selectedServer"]
    return state.setIn( path, selectedServerUrl)
  },
  [UPDATE_REQUEST_BODY_VALUE]: (state, { payload: { value, pathMethod } } ) =>{
    let [path, method] = pathMethod
    return state.setIn( [ "requestData", path, method, "bodyValue" ], value)
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
}
