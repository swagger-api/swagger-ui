import { persistReducer } from "redux-persist"
import immutableTransform from "redux-persist-transform-immutable"
import storage from "redux-persist/lib/storage" // localStorage for web

import reducers from "./reducers"
import * as actions from "./actions"
import * as selectors from "./selectors"
import * as specWrapActionReplacements from "./spec-wrap-actions"

const objectify = (obj, [k, v]) => ({ ...obj, [k]: v });

const persistConfig = {
  transforms: [immutableTransform()],
  key: "root",
  storage
}

export default function() {
  return {
    afterLoad(system) {
      this.rootInjects = this.rootInjects || {}
      this.rootInjects.initOAuth = system.authActions.configureAuth
      this.rootInjects.preauthorizeApiKey = preauthorizeApiKey.bind(null, system)
      this.rootInjects.preauthorizeBasic = preauthorizeBasic.bind(null, system)
    },
    statePlugins: {
      auth: {
        reducers: Object.entries(reducers).map(
          ([actionType, reducer]) => [actionType, persistReducer(persistConfig, reducer)]
        ).reduce(objectify, {});
        actions,
        selectors
      },
      spec: {
        wrapActions: specWrapActionReplacements
      }
    }
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
