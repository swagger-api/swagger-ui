import YAML from "js-yaml"
import parseUrl from "url-parse"
import serializeError from "serialize-error"

// Actions conform to FSA (flux-standard-actions)
// {type: string,payload: Any|Error, meta: obj, error: bool}

export const UPDATE_SPEC = "spec_update_spec"
export const UPDATE_URL = "spec_update_url"
export const UPDATE_JSON = "spec_update_json"
export const UPDATE_PARAM = "spec_update_param"
export const VALIDATE_PARAMS = "spec_validate_param"
export const SET_RESPONSE = "spec_set_response"
export const SET_REQUEST = "spec_set_request"
export const LOG_REQUEST = "spec_log_request"
export const CLEAR_RESPONSE = "spec_clear_response"
export const CLEAR_REQUEST = "spec_clear_request"
export const ClEAR_VALIDATE_PARAMS = "spec_clear_validate_param"
export const UPDATE_OPERATION_VALUE = "spec_update_operation_value"
export const UPDATE_RESOLVED = "spec_update_resolved"
export const SET_SCHEME = "set_scheme"

export function updateSpec(spec) {
  if(spec instanceof Error) {
    return {type: UPDATE_SPEC, error: true, payload: spec}
  }

  if(typeof spec === "string") {
    return {
      type: UPDATE_SPEC,
      payload: spec.replace(/\t/g, "  ") || ""
    }
  }

  return {
    type: UPDATE_SPEC,
    payload: ""
  }
}

export function updateResolved(spec) {
  return {
    type: UPDATE_RESOLVED,
    payload: spec
  }
}

export function updateUrl(url) {
  return {type: UPDATE_URL, payload: url}
}

export function updateJsonSpec(json) {
  if(!json || typeof json !== "object") {
    throw new Error("updateJson must only accept a simple JSON object")
  }
  return {type: UPDATE_JSON, payload: json}
}

export const parseToJson = (str) => ({specActions, specSelectors, errActions}) => {
  let { specStr } = specSelectors

  let json = null
  try {
    str = str || specStr()
    errActions.clear({ source: "parser" })
    json = YAML.safeLoad(str)
  } catch(e) {
    // TODO: push error to state
    console.error(e)
    return errActions.newSpecErr({
      source: "parser",
      level: "error",
      message: e.reason,
      line: e.mark && e.mark.line ? e.mark.line + 1 : undefined
    })
  }
  return specActions.updateJsonSpec(json)
}

export const resolveSpec = (json, url) => ({specActions, specSelectors, errActions, fn: { fetch, resolve, AST }, getConfigs}) => {
  const { modelPropertyMacro, parameterMacro } = getConfigs()

  if(typeof(json) === "undefined") {
    json = specSelectors.specJson()
  }
  if(typeof(url) === "undefined") {
    url = specSelectors.url()
  }

  let { getLineNumberForPath } = AST

  let specStr = specSelectors.specStr()

  return resolve({fetch, spec: json, baseDoc: url, modelPropertyMacro, parameterMacro })
  .then( ({spec, errors}) => {
    errActions.clear({
      type: "thrown"
     })

    if(errors.length > 0) {
      let preparedErrors = errors
        .map(err => {
          console.error(err)
          err.line = err.fullPath ? getLineNumberForPath(specStr, err.fullPath) : null
          err.path = err.fullPath ? err.fullPath.join(".") : null
          err.level = "error"
          err.type = "thrown"
          err.source = "resolver"
          Object.defineProperty(err, "message", { enumerable: true, value: err.message })
          return err
        })
      errActions.newThrownErrBatch(preparedErrors)
    }

    return specActions.updateResolved(spec)
  })
}

export const formatIntoYaml = () => ({specActions, specSelectors}) => {
  let { specStr } = specSelectors
  let { updateSpec } = specActions

  try {
    let yaml = YAML.safeDump(YAML.safeLoad(specStr()), {indent: 2})
    updateSpec(yaml)
  } catch(e) {
    updateSpec(e)
  }
}

export function changeParam( path, paramName, value, isXml ){
  return {
    type: UPDATE_PARAM,
    payload:{ path, value, paramName, isXml }
  }
}

export function validateParams( payload ){
  return {
    type: VALIDATE_PARAMS,
    payload:{ pathMethod: payload }
  }
}

export function clearValidateParams( payload ){
  return {
    type: ClEAR_VALIDATE_PARAMS,
    payload:{ pathMethod: payload }
  }
}

export function changeConsumesValue(path, value) {
  return {
    type: UPDATE_OPERATION_VALUE,
    payload:{ path, value, key: "consumes_value" }
  }
}

export function changeProducesValue(path, value) {
  return {
    type: UPDATE_OPERATION_VALUE,
    payload:{ path, value, key: "produces_value" }
  }
}

export const setResponse = ( path, method, res ) => {
  return {
    payload: { path, method, res },
    type: SET_RESPONSE
  }
}

export const setRequest = ( path, method, req ) => {
  return {
    payload: { path, method, req },
    type: SET_REQUEST
  }
}

// This is for debugging, remove this comment if you depend on this action
export const logRequest = (req) => {
  return {
    payload: req,
    type: LOG_REQUEST
  }
}

// Actually fire the request via fn.execute
// (For debugging) and ease of testing
export const executeRequest = (req) => ({fn, specActions, specSelectors}) => {
  let { pathName, method, operation } = req

  let op = operation.toJS()

  // if url is relative, parseUrl makes it absolute by inferring from `window.location`
  req.contextUrl = parseUrl(specSelectors.url()).toString()


  if(op && op.operationId) {
    req.operationId = op.operationId
  } else if(op && pathName && method) {
    req.operationId = fn.opId(op, pathName, method)
  }

  let parsedRequest = Object.assign({}, req)
  parsedRequest = fn.buildRequest(parsedRequest)

  specActions.setRequest(req.pathName, req.method, parsedRequest)

  return fn.execute(req)
  .then( res => specActions.setResponse(req.pathName, req.method, res))
  .catch( err => specActions.setResponse(req.pathName, req.method, { error: true, err: serializeError(err) } ) )
}


// I'm using extras as a way to inject properties into the final, `execute` method - It's not great. Anyone have a better idea? @ponelat
export const execute = ( { path, method, ...extras }={} ) => (system) => {
  let { fn:{fetch}, specSelectors, specActions } = system
  let spec = specSelectors.spec().toJS()
  let scheme = specSelectors.operationScheme(path, method)
  let { requestContentType, responseContentType } = specSelectors.contentTypeValues([path, method]).toJS()
  let isXml = /xml/i.test(requestContentType)
  let parameters = specSelectors.parameterValues([path, method], isXml).toJS()

  return specActions.executeRequest({fetch, spec, pathName: path, method, parameters, requestContentType, scheme, responseContentType, ...extras })
}

export function clearResponse (path, method) {
  return {
    type: CLEAR_RESPONSE,
    payload:{ path, method }
  }
}

export function clearRequest (path, method) {
  return {
    type: CLEAR_REQUEST,
    payload:{ path, method }
  }
}

export function setScheme (scheme, path, method) {
  return {
    type: SET_SCHEME,
    payload: { scheme, path, method }
  }
}
