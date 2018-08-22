import YAML from "@kyleshockey/js-yaml"
import { Map } from "immutable"
import parseUrl from "url-parse"
import serializeError from "serialize-error"
import isString from "lodash/isString"
import debounce from "lodash/debounce"
import set from "lodash/set"
import { isJSONObject } from "core/utils"

// Actions conform to FSA (flux-standard-actions)
// {type: string,payload: Any|Error, meta: obj, error: bool}

export const UPDATE_SPEC = "spec_update_spec"
export const UPDATE_URL = "spec_update_url"
export const UPDATE_JSON = "spec_update_json"
export const UPDATE_PARAM = "spec_update_param"
export const UPDATE_EMPTY_PARAM_INCLUSION = "spec_update_empty_param_inclusion"
export const VALIDATE_PARAMS = "spec_validate_param"
export const SET_RESPONSE = "spec_set_response"
export const SET_REQUEST = "spec_set_request"
export const SET_MUTATED_REQUEST = "spec_set_mutated_request"
export const LOG_REQUEST = "spec_log_request"
export const CLEAR_RESPONSE = "spec_clear_response"
export const CLEAR_REQUEST = "spec_clear_request"
export const CLEAR_VALIDATE_PARAMS = "spec_clear_validate_param"
export const UPDATE_OPERATION_META_VALUE = "spec_update_operation_meta_value"
export const UPDATE_RESOLVED = "spec_update_resolved"
export const UPDATE_RESOLVED_SUBTREE = "spec_update_resolved_subtree"
export const SET_SCHEME = "set_scheme"

const toStr = (str) => isString(str) ? str : ""

export function updateSpec(spec) {
  const cleanSpec = (toStr(spec)).replace(/\t/g, "  ")
  if(typeof spec === "string") {
    return {
      type: UPDATE_SPEC,
      payload: cleanSpec
    }
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
  if(json && typeof json === "object") {
    return specActions.updateJsonSpec(json)
  }
  return {}
}

let hasWarnedAboutResolveSpecDeprecation = false

export const resolveSpec = (json, url) => ({specActions, specSelectors, errActions, fn: { fetch, resolve, AST = {} }, getConfigs}) => {
  if(!hasWarnedAboutResolveSpecDeprecation) {
    console.warn(`specActions.resolveSpec is deprecated since v3.10.0 and will be removed in v4.0.0; use requestResolvedSubtree instead!`)
    hasWarnedAboutResolveSpecDeprecation = true
  }

  const {
    modelPropertyMacro,
    parameterMacro,
    requestInterceptor,
    responseInterceptor
  } = getConfigs()

  if(typeof(json) === "undefined") {
    json = specSelectors.specJson()
  }
  if(typeof(url) === "undefined") {
    url = specSelectors.url()
  }

  let getLineNumberForPath = AST.getLineNumberForPath ? AST.getLineNumberForPath : () => undefined

  let specStr = specSelectors.specStr()

  return resolve({
    fetch,
    spec: json,
    baseDoc: url,
    modelPropertyMacro,
    parameterMacro,
    requestInterceptor,
    responseInterceptor
  }).then( ({spec, errors}) => {
      errActions.clear({
        type: "thrown"
      })
      if(Array.isArray(errors) && errors.length > 0) {
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

let requestBatch = []

const debResolveSubtrees = debounce(async () => {
  const system = requestBatch.system // Just a reference to the "latest" system

  if(!system) {
    console.error("debResolveSubtrees: don't have a system to operate on, aborting.")
    return
  }
    const {
      errActions,
      errSelectors,
      fn: {
        resolveSubtree,
        AST = {}
      },
      specSelectors,
      specActions,
    } = system

  if(!resolveSubtree) {
    console.error("Error: Swagger-Client did not provide a `resolveSubtree` method, doing nothing.")
    return
  }

  let getLineNumberForPath = AST.getLineNumberForPath ? AST.getLineNumberForPath : () => undefined

  const specStr = specSelectors.specStr()

  const {
    modelPropertyMacro,
    parameterMacro,
    requestInterceptor,
    responseInterceptor
  } = system.getConfigs()

  try {
    var batchResult = await requestBatch.reduce(async (prev, path) => {
      const { resultMap, specWithCurrentSubtrees } = await prev
      const { errors, spec } = await resolveSubtree(specWithCurrentSubtrees, path, {
        baseDoc: specSelectors.url(),
        modelPropertyMacro,
        parameterMacro,
        requestInterceptor,
        responseInterceptor
      })

      if(errSelectors.allErrors().size) {
        errActions.clear({
          type: "thrown"
        })
      }

      if(Array.isArray(errors) && errors.length > 0) {
        let preparedErrors = errors
          .map(err => {
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

      set(resultMap, path, spec)
      set(specWithCurrentSubtrees, path, spec)

      return {
        resultMap,
        specWithCurrentSubtrees
      }
    }, Promise.resolve({
      resultMap: (specSelectors.specResolvedSubtree([]) || Map()).toJS(),
      specWithCurrentSubtrees: specSelectors.specJson().toJS()
    }))

    delete requestBatch.system
    requestBatch = [] // Clear stack
  } catch(e) {
    console.error(e)
  }

  specActions.updateResolvedSubtree([], batchResult.resultMap)
}, 35)

export const requestResolvedSubtree = path => system => {
  requestBatch.push(path)
  requestBatch.system = system
  debResolveSubtrees()
}

export function changeParam( path, paramName, paramIn, value, isXml ){
  return {
    type: UPDATE_PARAM,
    payload:{ path, value, paramName, paramIn, isXml }
  }
}

export function changeParamByIdentity( pathMethod, param, value, isXml ){
  return {
    type: UPDATE_PARAM,
    payload:{ path: pathMethod, param, value, isXml }
  }
}

export const updateResolvedSubtree = (path, value) => {
  return {
    type: UPDATE_RESOLVED_SUBTREE,
    payload: { path, value }
  }
}

export const invalidateResolvedSubtreeCache = () => {
  return {
    type: UPDATE_RESOLVED_SUBTREE,
    payload: {
      path: [],
      value: Map()
    }
  }
}

export const validateParams = ( payload, isOAS3 ) =>{
  return {
    type: VALIDATE_PARAMS,
    payload:{
      pathMethod: payload,
      isOAS3
    }
  }
}

export const updateEmptyParamInclusion = ( pathMethod, paramName, paramIn, includeEmptyValue ) =>{
  return {
    type: UPDATE_EMPTY_PARAM_INCLUSION,
    payload:{
      pathMethod,
      paramName,
      paramIn,
      includeEmptyValue
    }
  }
}

export function clearValidateParams( payload ){
  return {
    type: CLEAR_VALIDATE_PARAMS,
    payload:{ pathMethod: payload }
  }
}

export function changeConsumesValue(path, value) {
  return {
    type: UPDATE_OPERATION_META_VALUE,
    payload:{ path, value, key: "consumes_value" }
  }
}

export function changeProducesValue(path, value) {
  return {
    type: UPDATE_OPERATION_META_VALUE,
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

export const setMutatedRequest = ( path, method, req ) => {
  return {
    payload: { path, method, req },
    type: SET_MUTATED_REQUEST
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
export const executeRequest = (req) =>
  ({fn, specActions, specSelectors, getConfigs, oas3Selectors}) => {
    let { pathName, method, operation } = req
    let { requestInterceptor, responseInterceptor } = getConfigs()

    
    let op = operation.toJS()
    
    // ensure that explicitly-included params are in the request

    if(op && op.parameters && op.parameters.length) {
      op.parameters
        .filter(param => param && param.allowEmptyValue === true)
        .forEach(param => {
          if (specSelectors.parameterInclusionSettingFor([pathName, method], param.name, param.in)) {
            req.parameters = req.parameters || {}
            const paramValue = req.parameters[param.name]

            // if the value is falsy or an empty Immutable iterable...
            if(!paramValue || (paramValue && paramValue.size === 0)) {
              // set it to empty string, so Swagger Client will treat it as
              // present but empty.
              req.parameters[param.name] = ""
            }
          }
        })
    }

    // if url is relative, parseUrl makes it absolute by inferring from `window.location`
    req.contextUrl = parseUrl(specSelectors.url()).toString()

    if(op && op.operationId) {
      req.operationId = op.operationId
    } else if(op && pathName && method) {
      req.operationId = fn.opId(op, pathName, method)
    }

    if(specSelectors.isOAS3()) {
      const namespace = `${pathName}:${method}`

      req.server = oas3Selectors.selectedServer(namespace) || oas3Selectors.selectedServer()

      const namespaceVariables = oas3Selectors.serverVariables({
        server: req.server,
        namespace
      }).toJS()
      const globalVariables = oas3Selectors.serverVariables({ server: req.server }).toJS()

      req.serverVariables = Object.keys(namespaceVariables).length ? namespaceVariables : globalVariables

      req.requestContentType = oas3Selectors.requestContentType(pathName, method)
      req.responseContentType = oas3Selectors.responseContentType(pathName, method) || "*/*"
      const requestBody = oas3Selectors.requestBodyValue(pathName, method)

      if(isJSONObject(requestBody)) {
        req.requestBody = JSON.parse(requestBody)
      } else if(requestBody && requestBody.toJS) {
        req.requestBody = requestBody.toJS()
      } else{
        req.requestBody = requestBody
      }
    }

    let parsedRequest = Object.assign({}, req)
    parsedRequest = fn.buildRequest(parsedRequest)

    specActions.setRequest(req.pathName, req.method, parsedRequest)

    let requestInterceptorWrapper = function(r) {
      let mutatedRequest = requestInterceptor.apply(this, [r])
      let parsedMutatedRequest = Object.assign({}, mutatedRequest)
      specActions.setMutatedRequest(req.pathName, req.method, parsedMutatedRequest)
      return mutatedRequest
    }

    req.requestInterceptor = requestInterceptorWrapper
    req.responseInterceptor = responseInterceptor

    // track duration of request
    const startTime = Date.now()


    return fn.execute(req)
    .then( res => {
      res.duration = Date.now() - startTime
      specActions.setResponse(req.pathName, req.method, res)
    } )
    .catch(
      err => specActions.setResponse(req.pathName, req.method, {
        error: true, err: serializeError(err)
      })
    )
  }


// I'm using extras as a way to inject properties into the final, `execute` method - It's not great. Anyone have a better idea? @ponelat
export const execute = ( { path, method, ...extras }={} ) => (system) => {
  let { fn:{fetch}, specSelectors, specActions } = system
  let spec = specSelectors.specJsonWithResolvedSubtrees().toJS()
  let scheme = specSelectors.operationScheme(path, method)
  let { requestContentType, responseContentType } = specSelectors.contentTypeValues([path, method]).toJS()
  let isXml = /xml/i.test(requestContentType)
  let parameters = specSelectors.parameterValues([path, method], isXml).toJS()

  return specActions.executeRequest({
    ...extras,
    fetch,
    spec,
    pathName: path,
    method, parameters,
    requestContentType,
    scheme,
    responseContentType
  })
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
