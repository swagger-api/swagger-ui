import reducers from "./reducers"
import * as actions from "./actions"
import * as selectors from "./selectors"
import * as specWrapActionReplacements from "./spec-wrap-actions"

export default function() {
  return {
    afterLoad(system) {
      this.rootInjects = this.rootInjects || {}
      this.rootInjects.initOAuth = system.authActions.configureAuth
      this.rootInjects.preauthorizeApiKey = preauthorizeApiKey.bind(null, system)
      this.rootInjects.preauthorizeBasic = preauthorizeBasic.bind(null, system)

      checkAuthorizationPreservation(system)      
    },
    statePlugins: {
      auth: {
        reducers,
        actions,
        selectors
      },
      spec: {
        wrapActions: specWrapActionReplacements
      }
    }
  }
}

function checkAuthorizationPreservation(system) {

  const configs = system.getConfigs()
  
  if (configs.preserveAuthorization) {     

    const authorized = localStorage.getItem("authorized")

    system.authActions.configurePreservation({
      preserve: configs.preserveAuthorization,
      authorized: authorized ? JSON.parse(authorized) : null
    })                

  }
}

export function preauthorizeBasic(system, key, username, password) {
  const {
    authActions: { authorize },
    specSelectors: { specJson, isOAS3 }
  } = system

  const definitionBase = isOAS3() ? ["components", "securitySchemes"] : ["securityDefinitions"]

  const schema = specJson().getIn([...definitionBase, key])

  if(!schema) {
    return null
  }

  return authorize({
    [key]: {
      value: {
        username,
        password,
      },
      schema: schema.toJS()
    }
  })
}

export function preauthorizeApiKey(system, key, value) {
  const {
    authActions: { authorize },
    specSelectors: { specJson, isOAS3 }
  } = system

  const definitionBase = isOAS3() ? ["components", "securitySchemes"] : ["securityDefinitions"]

  const schema = specJson().getIn([...definitionBase, key])

  if(!schema) {
    return null
  }

  return authorize({
    [key]: {
      value,
      schema: schema.toJS()
    }
  })
}
