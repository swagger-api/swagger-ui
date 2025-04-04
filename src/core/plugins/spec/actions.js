import YAML, { JSON_SCHEMA } from "js-yaml"
import { Map as ImmutableMap } from "immutable"
import parseUrl from "url-parse"
import isString from "lodash/isString"
import debounce from "lodash/debounce"
import set from "lodash/set"
import assocPath from "lodash/fp/assocPath"
import constant from "lodash/constant"

import { paramToValue, isEmptyValue } from "core/utils"

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
    json = YAML.load(str, { schema: JSON_SCHEMA })
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
  return specActions.updateJsonSpec({})
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
    baseDoc: String(new URL(url, document.baseURI)),
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

const debResolveSubtrees = debounce(() => {
  const systemPartitionedBatches = requestBatch.reduce((acc, { path, system }) => {
    if (!acc.has(system)) acc.set(system, [])
    acc.get(system).push(path)
    return acc
  }, new Map())

  requestBatch = [] // clear stack

  systemPartitionedBatches.forEach(async (systemRequestBatch, system) => {
    if(!system) {
      console.error("debResolveSubtrees: don't have a system to operate on, aborting.")
      return
    }
    if(!system.fn.resolveSubtree) {
      console.error("Error: Swagger-Client did not provide a `resolveSubtree` method, doing nothing.")
      return
    }
    const {
      errActions,
      errSelectors,
      fn: {
        resolveSubtree,
        fetch,
        AST = {}
      },
      specSelectors,
      specActions,
    } = system
    const getLineNumberForPath = AST.getLineNumberForPath ?? constant(undefined)
    const specStr = specSelectors.specStr()
    const {
      modelPropertyMacro,
      parameterMacro,
      requestInterceptor,
      responseInterceptor
    } = system.getConfigs()

    try {
      const batchResult = await systemRequestBatch.reduce(async (prev, path) => {
        let { resultMap, specWithCurrentSubtrees } = await prev
        const { errors, spec } = await resolveSubtree(specWithCurrentSubtrees, path, {
          baseDoc: String(new URL(specSelectors.url(), document.baseURI)),
          modelPropertyMacro,
          parameterMacro,
          requestInterceptor,
          responseInterceptor
        })

        if(errSelectors.allErrors().size) {
          errActions.clearBy(err => {
            // keep if...
            return err.get("type") !== "thrown" // it's not a thrown error
              || err.get("source") !== "resolver" // it's not a resolver error
              || !err.get("fullPath")?.every((key, i) => key === path[i] || path[i] === undefined) // it's not within the path we're resolving
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

        if (spec && specSelectors.isOAS3() && path[0] === "components" && path[1] === "securitySchemes") {
          // Resolve OIDC URLs if present
          await Promise.all(Object.values(spec)
            .filter((scheme) => scheme?.type === "openIdConnect")
            .map(async (oidcScheme) => {
              const req = {
                url: oidcScheme.openIdConnectUrl,
                requestInterceptor: requestInterceptor,
                responseInterceptor: responseInterceptor
              }
              try {
                const res = await fetch(req)
                if (res instanceof Error || res.status >= 400) {
                  console.error(res.statusText + " " + req.url)
                } else {
                  oidcScheme.openIdConnectData = JSON.parse(res.text)
                }
              } catch (e) {
                console.error(e)
              }
            }))
        }
        set(resultMap, path, spec)
        specWithCurrentSubtrees = assocPath(path, spec, specWithCurrentSubtrees)

        return {
          resultMap,
          specWithCurrentSubtrees
        }
      }, Promise.resolve({
        resultMap: (specSelectors.specResolvedSubtree([]) || ImmutableMap()).toJS(),
        specWithCurrentSubtrees: specSelectors.specJS()
      }))

      specActions.updateResolvedSubtree([], batchResult.resultMap)
    } catch(e) {
      console.error(e)
    }
  })
}, 35)

export const requestResolvedSubtree = path => system => {
  const isPathAlreadyBatched = requestBatch.find(({ path: batchedPath, system: batchedSystem }) => {
    return batchedSystem === system && batchedPath.toString() === path.toString()
  })

  if(isPathAlreadyBatched) {
    return
  }

  requestBatch.push({ path, system })

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
      value: ImmutableMap()
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

    if (operation && operation.get("parameters")) {
      operation.get("parameters")
        .filter(param => param && param.get("allowEmptyValue") === true)
        .forEach(param => {
          if (specSelectors.parameterInclusionSettingFor([pathName, method], param.get("name"), param.get("in"))) {
            req.parameters = req.parameters || {}
            const paramValue = paramToValue(param, req.parameters)

            // if the value is falsy or an empty Immutable iterable...
            if(!paramValue || (paramValue && paramValue.size === 0)) {
              // set it to empty string, so Swagger Client will treat it as
              // present but empty.
              req.parameters[param.get("name")] = ""
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
      const requestBodyInclusionSetting = oas3Selectors.requestBodyInclusionSetting(pathName, method)

      if(requestBody && requestBody.toJS) {
        req.requestBody = requestBody
          .map(
            (val) => {
              if (ImmutableMap.isMap(val)) {
                return val.get("value")
              }
              return val
            }
          )
          .filter(
            (value, key) => (Array.isArray(value)
                ? value.length !== 0
                : !isEmptyValue(value)
            ) || requestBodyInclusionSetting.get(key)
          )
          .toJS()
      } else {
        req.requestBody = requestBody
      }
    }

    let parsedRequest = Object.assign({}, req)
    parsedRequest = fn.buildRequest(parsedRequest)

    specActions.setRequest(req.pathName, req.method, parsedRequest)

    let requestInterceptorWrapper = async (r) => {
      let mutatedRequest = await requestInterceptor.apply(this, [r])
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
        err => {
          // console.error(err)
          if(err.message === "Failed to fetch") {
            err.name = ""
            err.message = "**Failed to fetch.**  \n**Possible Reasons:** \n  - CORS \n  - Network Failure \n  - URL scheme must be \"http\" or \"https\" for CORS request."
          }
          specActions.setResponse(req.pathName, req.method, {
            error: true, err
          })
        }
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
