// Actions conform to FSA (flux-standard-actions)
// {type: string,payload: Any|Error, meta: obj, error: bool}

import { escapeDeepLinkPath } from "core/utils"

export const UPDATE_SELECTED_SERVER = "oas3_set_servers"
export const UPDATE_REQUEST_BODY_VALUE = "oas3_set_request_body_value"
export const UPDATE_REQUEST_BODY_VALUE_RETAIN_FLAG = "oas3_set_request_body_retain_flag"
export const UPDATE_REQUEST_BODY_INCLUSION = "oas3_set_request_body_inclusion"
export const UPDATE_ACTIVE_EXAMPLES_MEMBER = "oas3_set_active_examples_member"
export const UPDATE_REQUEST_CONTENT_TYPE = "oas3_set_request_content_type"
export const UPDATE_RESPONSE_CONTENT_TYPE = "oas3_set_response_content_type"
export const UPDATE_SERVER_VARIABLE_VALUE = "oas3_set_server_variable_value"
export const SET_REQUEST_BODY_VALIDATE_ERROR = "oas3_set_request_body_validate_error"
export const CLEAR_REQUEST_BODY_VALIDATE_ERROR = "oas3_clear_request_body_validate_error"
export const CLEAR_REQUEST_BODY_VALUE = "oas3_clear_request_body_value"

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

export const setRetainRequestBodyValueFlag = ({ value, pathMethod }) => {
  return {
    type: UPDATE_REQUEST_BODY_VALUE_RETAIN_FLAG,
    payload: { value, pathMethod }
  }
}


export function setRequestBodyInclusion ({ value, pathMethod, name }) {
  return {
    type: UPDATE_REQUEST_BODY_INCLUSION,
    payload: { value, pathMethod, name }
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

export const setRequestBodyValidateError = ({ path, method, validationErrors }) => {
  return {
    type: SET_REQUEST_BODY_VALIDATE_ERROR,
    payload: { path, method, validationErrors }
  }
}

export const clearRequestBodyValidateError = ({ path, method }) => {
  return {
    type: CLEAR_REQUEST_BODY_VALIDATE_ERROR,
    payload: { path, method }
  }
}

export const initRequestBodyValidateError = ({ pathMethod } ) => {
  return {
    type: CLEAR_REQUEST_BODY_VALIDATE_ERROR,
    payload: { path: pathMethod[0], method: pathMethod[1] }
  }
}

export const clearRequestBodyValue = ({ pathMethod }) => {
  return {
    type:  CLEAR_REQUEST_BODY_VALUE,
    payload: { pathMethod }
  }
}

// Resolves an RFC 6901 JSON Pointer against an Immutable structure.
// "$response.body#/data/id" arrives here as pointer === "/data/id".
// Handles multi-segment pointers and the '~1'/'~0' escaping rules, unlike
// a naive single-segment string-key lookup.
function resolveJsonPointer(obj, pointer) {
  if (!pointer || obj == null) {
    return obj
  }
  const segments = pointer
    .split("/")
    .filter(Boolean)
    .map(seg => seg.replace(/~1/g, "/").replace(/~0/g, "~"))

  if (typeof obj.getIn === "function") {
    return obj.getIn(segments)
  }

  return segments.reduce((acc, seg) => (acc == null ? undefined : acc[seg]), obj)
}

export const executeLink = ({ operationId, parameters, responseContext }) => (system) => {
  const { specSelectors, specActions, layoutActions } = system

  if (!operationId) {
    console.warn("OperationLink: link has no operationId (operationRef targets aren't supported yet)")
    return
  }

  const operationMap = specSelectors.operationById(operationId)
  if (!operationMap) {
    console.warn(`OperationLink: no operation found with operationId "${operationId}"`)
    return
  }

  const path = operationMap.get("path")
  const method = operationMap.get("method")

  // Tags live directly on the operation object; an operation with none
  // falls under Swagger UI's own "default" tag grouping.
  const tags = operationMap.getIn(["operation", "tags"])
  const tag = (tags && tags.size > 0) ? tags.first() : "default"
  const showKey = ["operations", tag, operationId]

  layoutActions.show(showKey, true)

  if (parameters) {
    const paramsObj = typeof parameters.toJS === "function" ? parameters.toJS() : parameters
    const declaredParams = operationMap.getIn(["operation", "parameters"]) || []
    const responseBody = responseContext && typeof responseContext.get === "function"
      ? responseContext.get("body")
      : responseContext?.body

    Object.entries(paramsObj).forEach(([paramName, paramExpr]) => {
      let resolvedValue = paramExpr

      if (typeof paramExpr === "string" && paramExpr.startsWith("$response.body#")) {
        const pointer = paramExpr.replace("$response.body#", "")
        const resolved = resolveJsonPointer(responseBody, pointer)
        resolvedValue = resolved !== undefined ? resolved : paramExpr
      }

      if (resolvedValue !== null && resolvedValue !== undefined) {
        if (typeof resolvedValue === "object") {
          resolvedValue = JSON.stringify(resolvedValue)
        } else if (typeof resolvedValue !== "string") {
          resolvedValue = String(resolvedValue)
        }
      }

      const isPathParam = path.indexOf(`{${paramName}}`) !== -1
      const declared = typeof declaredParams.find === "function"
        ? declaredParams.find(p => p.get("name") === paramName)
        : undefined
      const paramIn = isPathParam ? "path" : (declared ? declared.get("in") : "query")

      specActions.changeParam([path, method], paramName, paramIn, resolvedValue, false)
    })
  }

  // Same id operation.jsx itself sets on its root element
  // (id={escapeDeepLinkPath(isShownKey.join("-"))}), so this finds the
  // real, already-rendered DOM node directly, no reliance on
  // readyToScroll's mount-time-only ref registration, which doesn't fire
  // again for an operation that's already mounted on an already-loaded
  // page (our case, vs. deep-linking's page-load-with-hash case).
  const elementId = escapeDeepLinkPath(showKey.join("-"))
  // A React re-render needs to happen (to reflect the just-dispatched
  // 'show') before the now-expanded content exists to scroll to.
  setTimeout(() => {
    const element = document.getElementById(elementId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, 0)
}
