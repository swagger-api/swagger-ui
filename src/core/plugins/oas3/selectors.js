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

export const selectedServer = onlyOAS3(state => {
    return state.getIn(["selectedServer"]) || ""
  }
)

export const requestBodyValue = onlyOAS3((state, path, method) => {
    return state.getIn(["requestData", path, method, "bodyValue"]) || null
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

export const serverVariableValue = onlyOAS3((state, server, key) => {
    return state.getIn(["serverVariableValues", server, key]) || null
  }
)

export const serverVariables = onlyOAS3((state, server) => {
    return state.getIn(["serverVariableValues", server]) || OrderedMap()
  }
)

export const serverEffectiveValue = onlyOAS3((state, server) => {
    let varValues = state.getIn(["serverVariableValues", server]) || OrderedMap()
    let str = server

    varValues.map((val, key) => {
      str = str.replace(new RegExp(`{${key}}`, "g"), val)
    })

    return str
  }
)
