import { OrderedMap } from "immutable"
import { isOAS3 as isOAS3Helper } from "./helpers"


// Helpers

function onlyOAS3(selector) {
  return (...args) => (system) => {
    const spec = system.getSystem().specSelectors.specJson()
    if(isOAS3Helper(spec)) {
      return selector(...args)
    } else {
      return null
    }
  }
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
