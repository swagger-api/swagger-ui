import { createSelector } from "reselect"
import constant from "lodash/constant"
import { sorters, paramToIdentifier } from "core/utils"
import { fromJS, Set, Map, OrderedMap, List } from "immutable"

const DEFAULT_TAG = "default"

const OPERATION_METHODS = [
  "get", "put", "post", "delete", "options", "head", "patch", "trace"
]

const state = state => {
  return state || Map()
}

export const lastError = createSelector(
  state,
  spec => spec.get("lastError")
)

export const url = createSelector(
  state,
  spec => spec.get("url")
)

export const specStr = createSelector(
  state,
  spec => spec.get("spec") || ""
)

export const specSource = createSelector(
  state,
  spec => spec.get("specSource") || "not-editor"
)

export const specJson = createSelector(
  state,
  spec => spec.get("json", Map())
)

export const specJS = createSelector(
  specJson,
  (spec) => spec.toJS()
)

export const specResolved = createSelector(
  state,
  spec => spec.get("resolved", Map())
)

export const specResolvedSubtree = (state, path) => {
  return state.getIn(["resolvedSubtrees", ...path], undefined)
}

const mergerFn = (oldVal, newVal) => {
  if(Map.isMap(oldVal) && Map.isMap(newVal)) {
    if(newVal.get("$$ref")) {
      // resolver artifacts indicated that this key was directly resolved
      // so we should drop the old value entirely
      return newVal
    }

    return OrderedMap().mergeWith(
      mergerFn,
      oldVal,
      newVal
    )
  }

  return newVal
}

export const specJsonWithResolvedSubtrees = createSelector(
  state,
  spec => OrderedMap().mergeWith(
    mergerFn,
    spec.get("json"),
    spec.get("resolvedSubtrees")
  )
)

// Default Spec ( as an object )
export const spec = state => {
  let res = specJson(state)
  return res
}

export const isOAS3 = createSelector(
  // isOAS3 is stubbed out here to work around an issue with injecting more selectors
  // in the OAS3 plugin, and to ensure that the function is always available.
  // It's not perfect, but our hybrid (core+plugin code) implementation for OAS3
  // needs this. //KS
  spec,
	() => false
)

export const info = createSelector(
  spec,
	spec => returnSelfOrNewMap(spec && spec.get("info"))
)

export const externalDocs = createSelector(
  spec,
	spec => returnSelfOrNewMap(spec && spec.get("externalDocs"))
)

export const version = createSelector(
	info,
	info => info && info.get("version")
)

export const semver = createSelector(
	version,
	version => /v?([0-9]*)\.([0-9]*)\.([0-9]*)/i.exec(version).slice(1)
)

export const paths = createSelector(
	specJsonWithResolvedSubtrees,
	spec => spec.get("paths")
)

export const validOperationMethods = constant(["get", "put", "post", "delete", "options", "head", "patch"])

export const operations = createSelector(
  paths,
  paths => {
    if(!paths || paths.size < 1)
      return List()

    let list = List()

    if(!paths || !paths.forEach) {
      return List()
    }

    paths.forEach((path, pathName) => {
      if(!path || !path.forEach) {
        return {}
      }
      path.forEach((operation, method) => {
        if(OPERATION_METHODS.indexOf(method) < 0) {
          return
        }
        list = list.push(fromJS({
          path: pathName,
          method,
          operation,
          id: `${method}-${pathName}`
        }))
      })
    })

    return list
  }
)

export const consumes = createSelector(
  spec,
  spec => Set(spec.get("consumes"))
)

export const produces = createSelector(
  spec,
  spec => Set(spec.get("produces"))
)

export const security = createSelector(
    spec,
    spec => spec.get("security", List())
)

export const securityDefinitions = createSelector(
    spec,
    spec => spec.get("securityDefinitions")
)


export const findDefinition = ( state, name ) => {
  const resolvedRes = state.getIn(["resolvedSubtrees", "definitions", name], null)
  const unresolvedRes = state.getIn(["json", "definitions", name], null)
  return resolvedRes || unresolvedRes || null
}

export const definitions = createSelector(
  spec,
  spec => {
    const res = spec.get("definitions")
    return Map.isMap(res) ? res : Map()
  }
)

export const basePath = createSelector(
    spec,
    spec => spec.get("basePath")
)

export const host = createSelector(
    spec,
    spec => spec.get("host")
)

export const schemes = createSelector(
    spec,
    spec => spec.get("schemes", Map())
)

export const operationsWithRootInherited = createSelector(
  [
    operations,
    consumes,
    produces
  ],
  (operations, consumes, produces) => {
    return operations.map( ops => ops.update("operation", op => {
      if(op) {
        if(!Map.isMap(op)) { return }
        return op.withMutations( op => {
          if ( !op.get("consumes") ) {
            op.update("consumes", a => Set(a).merge(consumes))
          }
          if ( !op.get("produces") ) {
            op.update("produces", a => Set(a).merge(produces))
          }
          return op
        })
      } else {
        // return something with Immutable methods
        return Map()
      }

    }))
  }
)

export const tags = createSelector(
  spec,
  json => {
    const tags = json.get("tags", List())
    return List.isList(tags) ? tags.filter(tag => Map.isMap(tag)) : List()
  }
)

export const tagDetails = (state, tag) => {
  let currentTags = tags(state) || List()
  return currentTags.filter(Map.isMap).find(t => t.get("name") === tag, Map())
}

export const operationsWithTags = createSelector(
  operationsWithRootInherited,
  tags,
  (operations, tags) => {
    return operations.reduce( (taggedMap, op) => {
      let tags = Set(op.getIn(["operation","tags"]))
      if(tags.count() < 1)
        return taggedMap.update(DEFAULT_TAG, List(), ar => ar.push(op))
      return tags.reduce( (res, tag) => res.update(tag, List(), (ar) => ar.push(op)), taggedMap )
    }, tags.reduce( (taggedMap, tag) => {
      return taggedMap.set(tag.get("name"), List())
    } , OrderedMap()))
  }
)

export const taggedOperations = (state) => ({ getConfigs }) => {
  let { tagsSorter, operationsSorter } = getConfigs()
  return operationsWithTags(state)
    .sortBy(
      (val, key) => key, // get the name of the tag to be passed to the sorter
      (tagA, tagB) => {
        let sortFn = (typeof tagsSorter === "function" ? tagsSorter : sorters.tagsSorter[ tagsSorter ])
        return (!sortFn ? null : sortFn(tagA, tagB))
      }
    )
    .map((ops, tag) => {
      let sortFn = (typeof operationsSorter === "function" ? operationsSorter : sorters.operationsSorter[ operationsSorter ])
      let operations = (!sortFn ? ops : ops.sort(sortFn))

      return Map({ tagDetails: tagDetails(state, tag), operations: operations })
    })
}

export const responses = createSelector(
  state,
  state => state.get( "responses", Map() )
)

export const requests = createSelector(
    state,
    state => state.get( "requests", Map() )
)

export const mutatedRequests = createSelector(
    state,
    state => state.get( "mutatedRequests", Map() )
)

export const responseFor = (state, path, method) => {
  return responses(state).getIn([path, method], null)
}

export const requestFor = (state, path, method) => {
  return requests(state).getIn([path, method], null)
}

export const mutatedRequestFor = (state, path, method) => {
  return mutatedRequests(state).getIn([path, method], null)
}

export const allowTryItOutFor = () => {
  // This is just a hook for now.
  return true
}

export const parameterWithMetaByIdentity = (state, pathMethod, param) => {
  const opParams = specJsonWithResolvedSubtrees(state).getIn(["paths", ...pathMethod, "parameters"], OrderedMap())
  const metaParams = state.getIn(["meta", "paths", ...pathMethod, "parameters"], OrderedMap())

  const mergedParams = opParams.map((currentParam) => {
    const inNameKeyedMeta = metaParams.get(`${param.get("in")}.${param.get("name")}`)
    const hashKeyedMeta = metaParams.get(`${param.get("in")}.${param.get("name")}.hash-${param.hashCode()}`)
    return OrderedMap().merge(
      currentParam,
      inNameKeyedMeta,
      hashKeyedMeta
    )
  })
  return mergedParams.find(curr => curr.get("in") === param.get("in") && curr.get("name") === param.get("name"), OrderedMap())
}

export const parameterInclusionSettingFor = (state, pathMethod, paramName, paramIn) => {
  const paramKey = `${paramIn}.${paramName}`
  return state.getIn(["meta", "paths", ...pathMethod, "parameter_inclusions", paramKey], false)
}


export const parameterWithMeta = (state, pathMethod, paramName, paramIn) => {
  const opParams = specJsonWithResolvedSubtrees(state).getIn(["paths", ...pathMethod, "parameters"], OrderedMap())
  const currentParam = opParams.find(param => param.get("in") === paramIn && param.get("name") === paramName, OrderedMap())
  return parameterWithMetaByIdentity(state, pathMethod, currentParam)
}

export const operationWithMeta = (state, path, method) => {
  const op = specJsonWithResolvedSubtrees(state).getIn(["paths", path, method], OrderedMap())
  const meta = state.getIn(["meta", "paths", path, method], OrderedMap())

  const mergedParams = op.get("parameters", List()).map((param) => {
    return parameterWithMetaByIdentity(state, [path, method], param)
  })

  return OrderedMap()
    .merge(op, meta)
    .set("parameters", mergedParams)
}

// Get the parameter value by parameter name
export function getParameter(state, pathMethod, name, inType) {
  pathMethod = pathMethod || []
  let params = state.getIn(["meta", "paths", ...pathMethod, "parameters"], fromJS([]))
  return params.find( (p) => {
    return Map.isMap(p) && p.get("name") === name && p.get("in") === inType
  }) || Map() // Always return a map
}

export const hasHost = createSelector(
  spec,
  spec => {
    const host = spec.get("host")
    return typeof host === "string" && host.length > 0 && host[0] !== "/"
  }
)

// Get the parameter values, that the user filled out
export function parameterValues(state, pathMethod, isXml) {
  pathMethod = pathMethod || []
  let paramValues = operationWithMeta(state, ...pathMethod).get("parameters", List())
  return paramValues.reduce( (hash, p) => {
    let value = isXml && p.get("in") === "body" ? p.get("value_xml") : p.get("value")
    if (List.isList(value)) {
      value = value.filter(v => v !== "")
    }
    return hash.set(paramToIdentifier(p, { allowHashes: false }), value)
  }, fromJS({}))
}

// True if any parameter includes `in: ?`
export function parametersIncludeIn(parameters, inValue="") {
  if(List.isList(parameters)) {
    return parameters.some( p => Map.isMap(p) && p.get("in") === inValue )
  }
}

// True if any parameter includes `type: ?`
export function parametersIncludeType(parameters, typeValue="") {
  if(List.isList(parameters)) {
    return parameters.some( p => Map.isMap(p) && p.get("type") === typeValue )
  }
}

// Get the consumes/produces value that the user selected
export function contentTypeValues(state, pathMethod) {
  pathMethod = pathMethod || []
  let op = specJsonWithResolvedSubtrees(state).getIn(["paths", ...pathMethod], fromJS({}))
  let meta = state.getIn(["meta", "paths", ...pathMethod], fromJS({}))
  let producesValue = currentProducesFor(state, pathMethod)

  const parameters = op.get("parameters") || new List()

  const requestContentType = (
    meta.get("consumes_value") ? meta.get("consumes_value")
      : parametersIncludeType(parameters, "file") ? "multipart/form-data"
      : parametersIncludeType(parameters, "formData") ? "application/x-www-form-urlencoded"
      : undefined
  )

  return fromJS({
    requestContentType,
    responseContentType: producesValue
  })
}

// Get the currently selected produces value for an operation
export function currentProducesFor(state, pathMethod) {
  pathMethod = pathMethod || []

  const operation = specJsonWithResolvedSubtrees(state).getIn([ "paths", ...pathMethod], null)

  if(operation === null) {
    // return nothing if the operation does not exist
    return
  }

  const currentProducesValue = state.getIn(["meta", "paths", ...pathMethod, "produces_value"], null)
  const firstProducesArrayItem = operation.getIn(["produces", 0], null)

  return currentProducesValue || firstProducesArrayItem || "application/json"

}

// Get the produces options for an operation
export function producesOptionsFor(state, pathMethod) {
  pathMethod = pathMethod || []

  const spec = specJsonWithResolvedSubtrees(state)
  const operation = spec.getIn([ "paths", ...pathMethod], null)

  if(operation === null) {
    // return nothing if the operation does not exist
    return
  }

  const [path] = pathMethod

  const operationProduces = operation.get("produces", null)
  const pathItemProduces = spec.getIn(["paths", path, "produces"], null)
  const globalProduces = spec.getIn(["produces"], null)

  return operationProduces || pathItemProduces || globalProduces
}

// Get the consumes options for an operation
export function consumesOptionsFor(state, pathMethod) {
  pathMethod = pathMethod || []

  const spec = specJsonWithResolvedSubtrees(state)
  const operation = spec.getIn(["paths", ...pathMethod], null)

  if (operation === null) {
    // return nothing if the operation does not exist
    return
  }

  const [path] = pathMethod

  const operationConsumes = operation.get("consumes", null)
  const pathItemConsumes = spec.getIn(["paths", path, "consumes"], null)
  const globalConsumes = spec.getIn(["consumes"], null)

  return operationConsumes || pathItemConsumes || globalConsumes
}

export const operationScheme = ( state, path, method ) => {
  let url = state.get("url")
  let matchResult = url.match(/^([a-z][a-z0-9+\-.]*):/)
  let urlScheme = Array.isArray(matchResult) ? matchResult[1] : null

  return state.getIn(["scheme", path, method]) || state.getIn(["scheme", "_defaultScheme"]) || urlScheme || ""
}

export const canExecuteScheme = ( state, path, method ) => {
  return ["http", "https"].indexOf(operationScheme(state, path, method)) > -1
}

export const validationErrors = (state, pathMethod) => {
  pathMethod = pathMethod || []
  let paramValues = state.getIn(["meta", "paths", ...pathMethod, "parameters"], fromJS([]))
  const result = []

  paramValues.forEach( (p) => {
    let errors = p.get("errors")
    if (errors && errors.count()) {
      errors
        .map((e) => (Map.isMap(e) ? `${e.get("propKey")}: ${e.get("error")}` : e))
        .forEach((e) => result.push(e))
    }
  })
  return result
}

export const validateBeforeExecute = (state, pathMethod) => {
  return validationErrors(state, pathMethod).length === 0
}

export const getOAS3RequiredRequestBodyContentType = (state, pathMethod) => {
  let requiredObj = {
    requestBody: false,
    requestContentType: {}
  }
  let requestBody = state.getIn(["resolvedSubtrees", "paths", ...pathMethod, "requestBody"], fromJS([]))
  if (requestBody.size < 1) {
    return requiredObj
  }
  if (requestBody.getIn(["required"])) {
    requiredObj.requestBody = requestBody.getIn(["required"])
  }
  requestBody.getIn(["content"]).entrySeq().forEach((contentType) => { // e.g application/json
    const key = contentType[0]
    if (contentType[1].getIn(["schema", "required"])) {
      const val = contentType[1].getIn(["schema", "required"]).toJS()
      requiredObj.requestContentType[key] = val
    }
  })
  return requiredObj
}

export const isMediaTypeSchemaPropertiesEqual = ( state, pathMethod, currentMediaType, targetMediaType) => {
  if((currentMediaType || targetMediaType) && currentMediaType === targetMediaType ) {
    return true
  }
  let requestBodyContent = state.getIn(["resolvedSubtrees", "paths", ...pathMethod, "requestBody", "content"], fromJS([]))
  if (requestBodyContent.size < 2 || !currentMediaType || !targetMediaType) {
    // nothing to compare
    return false
  }
  let currentMediaTypeSchemaProperties = requestBodyContent.getIn([currentMediaType, "schema", "properties"], fromJS([]))
  let targetMediaTypeSchemaProperties = requestBodyContent.getIn([targetMediaType, "schema", "properties"], fromJS([]))
  return !!currentMediaTypeSchemaProperties.equals(targetMediaTypeSchemaProperties)
}

function returnSelfOrNewMap(obj) {
  // returns obj if obj is an Immutable map, else returns a new Map
  return Map.isMap(obj) ? obj : new Map()
}
