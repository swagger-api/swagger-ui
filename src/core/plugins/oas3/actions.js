// Actions conform to FSA (flux-standard-actions)
// {type: string,payload: Any|Error, meta: obj, error: bool}

export const UPDATE_SELECTED_SERVER = "oas3_set_servers"
export const UPDATE_REQUEST_BODY_VALUE = "oas3_set_request_body_value"
export const UPDATE_ACTIVE_EXAMPLES_MEMBER = "oas3_set_active_examples_member"
export const UPDATE_REQUEST_CONTENT_TYPE = "oas3_set_request_content_type"
export const UPDATE_RESPONSE_CONTENT_TYPE = "oas3_set_response_content_type"
export const UPDATE_SERVER_VARIABLE_VALUE = "oas3_set_server_variable_value"

export function setSelectedServer (selectedServerUrl, namespace) {
  return {
    type: UPDATE_SELECTED_SERVER,
    payload: {selectedServerUrl, namespace}
  }
}

export function setRequestBodyValue ({ value, pathMethod }) {
  return {
    type: UPDATE_REQUEST_BODY_VALUE,
    payload: { value, pathMethod }
  }
}

export function setActiveExamplesMember ({ name, pathMethod, contextType, contextName }) {
  return {
    type: UPDATE_ACTIVE_EXAMPLES_MEMBER,
    payload: { name, pathMethod, contextType, contextName }
  }
}

export function setRequestContentType ({ value, pathMethod }) {
  return {
    type: UPDATE_REQUEST_CONTENT_TYPE,
    payload: { value, pathMethod }
  }
}

export function setResponseContentType ({ value, path, method }) {
  return {
    type: UPDATE_RESPONSE_CONTENT_TYPE,
    payload: { value, path, method }
  }
}

export function setServerVariableValue ({ server, namespace, key, val }) {
  return {
    type: UPDATE_SERVER_VARIABLE_VALUE,
    payload: { server, namespace, key, val }
  }
}
