import { OrderedMap, Map, List } from "immutable"
import { isOAS3 as isOAS3Helper } from "./helpers"
import { getDefaultRequestBodyValue } from "./components/request-body"
import { stringify } from "../../utils"

// Helpers

const onlyOAS3 =
  (selector) =>
  (state, ...args) =>
  (system) => {
    const spec = system.getSystem().specSelectors.specJson()

    if (isOAS3Helper(spec)) {
      const selectedValue = selector(state, ...args)
      return typeof selectedValue === "function"
        ? selectedValue(system)
        : selectedValue
    } else {
      return null
    }
  }


function validateRequestBodyIsRequired(selector) {
  return (...args) => (system) => {
    const specJson = system.getSystem().specSelectors.specJson()
    const argsList = [...args]
    // expect argsList[0] = state
    let pathMethod = argsList[1] || []
    let isOas3RequestBodyRequired = specJson.getIn(["paths", ...pathMethod, "requestBody", "required"])

    if (isOas3RequestBodyRequired) {
      return selector(...args)
    } else {
      // validation pass b/c not required
      return true
    }
  }
}

const validateRequestBodyValueExists = (state, pathMethod) => {
  pathMethod = pathMethod || []
  let oas3RequestBodyValue = state.getIn(["requestData", ...pathMethod, "bodyValue"])
  // context: bodyValue can be a String, or a Map
  if (!oas3RequestBodyValue) {
    return false
  }
  // validation pass if String is not empty, or if Map exists
  return true
}


export const selectedServer = onlyOAS3((state, namespace) => {
    const path = namespace ? [namespace, "selectedServer"] : ["selectedServer"]
    return state.getIn(path) || ""
  }
)

export const requestBodyValue = onlyOAS3((state, path, method) => {
    return state.getIn(["requestData", path, method, "bodyValue"]) || null
  }
)

export const shouldRetainRequestBodyValue = onlyOAS3((state, path, method) => {
    return state.getIn(["requestData", path, method, "retainBodyValue"]) || false
  }
)

export const selectDefaultRequestBodyValue = (state, path, method) => (system) => {
  const {oas3Selectors, specSelectors} = system.getSystem()
  const spec = specSelectors.specJson()
  if(isOAS3Helper(spec)) {
    const currentMediaType = oas3Selectors.requestContentType(path, method)
    if (currentMediaType) {
      return getDefaultRequestBodyValue(
        specSelectors.specResolvedSubtree(["paths", path, method, "requestBody"]),
        currentMediaType,
        oas3Selectors.activeExamplesMember(
          path, method,
          "requestBody",
          "requestBody",
        )
      )
    }
  }
  return null
}

export const hasUserEditedBody = onlyOAS3((state, path, method) => (system) => {
  const {oas3Selectors, specSelectors} = system.getSystem()

  let userHasEditedBody = false
  const currentMediaType = oas3Selectors.requestContentType(path, method)
  let userEditedRequestBody = oas3Selectors.requestBodyValue(path, method)
  const requestBody = specSelectors.specResolvedSubtree([
    "paths",
    path,
    method,
    "requestBody",
  ])

  /**
   * The only request body that can currently be edited is for Path Items that are direct values of OpenAPI.paths.
   * Path Item contained within the Callback Object or OpenAPI.webhooks (OpenAPI 3.1.0) have `Try it out`
   * disabled and thus body cannot be edited.
   */
  if (!requestBody) {
    return false
  }

  if (Map.isMap(userEditedRequestBody)) {
    // context is not application/json media-type
    userEditedRequestBody = stringify(userEditedRequestBody.mapEntries((kv) => Map.isMap(kv[1]) ? [kv[0], kv[1].get("value")] : kv).toJS())
  }
  if(List.isList(userEditedRequestBody)) {
    userEditedRequestBody = stringify(userEditedRequestBody)
  }
  if (currentMediaType) {
    const currentMediaTypeDefaultBodyValue = getDefaultRequestBodyValue(
      requestBody,
      currentMediaType,
      oas3Selectors.activeExamplesMember(
        path, method,
        "requestBody",
        "requestBody",
      )
    )
    userHasEditedBody = !!userEditedRequestBody && userEditedRequestBody !== currentMediaTypeDefaultBodyValue
  }
  return userHasEditedBody

})

export const requestBodyInclusionSetting = onlyOAS3((state, path, method) => {
    return state.getIn(["requestData", path, method, "bodyInclusion"]) || Map()
  }
)

export const requestBodyErrors = onlyOAS3((state, path, method) => {
    return state.getIn(["requestData", path, method, "errors"]) || null
  }
)

export const activeExamplesMember = onlyOAS3((state, path, method, type, name) => {
    return state.getIn(["examples", path, method, type, name, "activeExample"]) || null
  }
)

export const requestContentType = onlyOAS3((state, path, method) => {
    return state.getIn(["requestData", path, method, "requestContentType"]) || null
  }
)

export const responseContentType = onlyOAS3((state, path, method) => {
    return state.getIn(["requestData", path, method, "responseContentType"]) || null
  }
)

export const serverVariableValue = onlyOAS3((state, locationData, key) => {
    let path

    // locationData may take one of two forms, for backwards compatibility
    // Object: ({server, namespace?}) or String:(server)
    if(typeof locationData !== "string") {
      const { server, namespace } = locationData
      if(namespace) {
        path = [namespace, "serverVariableValues", server, key]
      } else {
        path = ["serverVariableValues", server, key]
      }
    } else {
      const server = locationData
      path = ["serverVariableValues", server, key]
    }

    return state.getIn(path) || null
  }
)

export const serverVariables = onlyOAS3((state, locationData) => {
    let path

    // locationData may take one of two forms, for backwards compatibility
    // Object: ({server, namespace?}) or String:(server)
    if(typeof locationData !== "string") {
      const { server, namespace } = locationData
      if(namespace) {
        path = [namespace, "serverVariableValues", server]
      } else {
        path = ["serverVariableValues", server]
      }
    } else {
      const server = locationData
      path = ["serverVariableValues", server]
    }

    return state.getIn(path) || OrderedMap()
  }
)

export const serverEffectiveValue = onlyOAS3((state, locationData) => {
    var varValues, serverValue

    // locationData may take one of two forms, for backwards compatibility
    // Object: ({server, namespace?}) or String:(server)
    if(typeof locationData !== "string") {
      const { server, namespace } = locationData
      serverValue = server
      if(namespace) {
        varValues = state.getIn([namespace, "serverVariableValues", serverValue])
      } else {
        varValues = state.getIn(["serverVariableValues", serverValue])
      }
    } else {
      serverValue = locationData
      varValues = state.getIn(["serverVariableValues", serverValue])
    }

    varValues = varValues || OrderedMap()
    let str = serverValue

    varValues.map((val, key) => {
      str = str.replace(new RegExp(`{${key}}`, "g"), val)
    })

    return str
  }
)

export const validateBeforeExecute = validateRequestBodyIsRequired(
  (state, pathMethod) => validateRequestBodyValueExists(state, pathMethod)
)

export const validateShallowRequired = (state, { oas3RequiredRequestBodyContentType, oas3RequestContentType, oas3RequestBodyValue} ) => {
  let missingRequiredKeys = []
  // context: json => String; urlencoded, form-data => Map
  if (!Map.isMap(oas3RequestBodyValue)) {
    return missingRequiredKeys
  }
  let requiredKeys = []
  // Cycle through list of possible contentTypes for matching contentType and defined requiredKeys
  Object.keys(oas3RequiredRequestBodyContentType.requestContentType).forEach((contentType) => {
    if (contentType === oas3RequestContentType) {
      let contentTypeVal = oas3RequiredRequestBodyContentType.requestContentType[contentType]
      contentTypeVal.forEach((requiredKey) => {
        if (requiredKeys.indexOf(requiredKey) < 0 ) {
          requiredKeys.push(requiredKey)
        }
      })
    }
  })
  requiredKeys.forEach((key) => {
    let requiredKeyValue = oas3RequestBodyValue.getIn([key, "value"])
    if (!requiredKeyValue) {
      missingRequiredKeys.push(key)
    }
  })
  return missingRequiredKeys
}
