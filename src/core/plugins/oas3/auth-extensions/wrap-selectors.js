import { createSelector } from "reselect"
import { List, Map, fromJS } from "immutable"


// Helpers

const state = state => state

function onlyOAS3(selector) {
  return (ori, system) => (...args) => {
    if(system.getSystem().specSelectors.isOAS3()) {
      // Pass the spec plugin state to Reselect to trigger on securityDefinitions update
      let resolvedSchemes = system.getState().getIn(["spec", "resolvedSubtrees",
        "components", "securitySchemes"])
      return selector(system, resolvedSchemes, ...args)
    } else {
      return ori(...args)
    }
  }
}

export const definitionsToAuthorize = onlyOAS3(createSelector(
    state,
    ({specSelectors}) => specSelectors.securityDefinitions(),
    (system, definitions) => {
      // Coerce our OpenAPI 3.0 definitions into monoflow definitions
      // that look like Swagger2 definitions.
      let list = List()

      if(!definitions) {
        return list
      }

      definitions.entrySeq().forEach( ([ defName, definition ]) => {
        const type = definition?.get("type")

        if(type === "oauth2") {
          definition.get("flows").entrySeq().forEach(([flowKey, flowVal]) => {
            let translatedDef = fromJS({
              flow: flowKey,
              authorizationUrl: flowVal.get("authorizationUrl"),
              tokenUrl: flowVal.get("tokenUrl"),
              scopes: flowVal.get("scopes"),
              type: definition.get("type"),
              description: definition.get("description")
            })

            list = list.push(new Map({
              [defName]: translatedDef.filter((v) => {
                // filter out unset values, sometimes `authorizationUrl`
                // and `tokenUrl` come out as `undefined` in the data
                return v !== undefined
              })
            }))
          })
        }
        if(type === "http" || type === "apiKey") {
          list = list.push(new Map({
            [defName]: definition
          }))
        }
        if(type === "openIdConnect" && definition.get("openIdConnectData")) {
          let oidcData = definition.get("openIdConnectData")
          let grants = oidcData.get("grant_types_supported") || ["authorization_code", "implicit"]
          grants.forEach((grant) => {
            // Convert from OIDC list of scopes to the OAS-style map with empty descriptions
            let translatedScopes = oidcData.get("scopes_supported") &&
              oidcData.get("scopes_supported").reduce((acc, cur) => acc.set(cur, ""), new Map())

            let translatedDef = fromJS({
              flow: grant,
              authorizationUrl: oidcData.get("authorization_endpoint"),
              tokenUrl: oidcData.get("token_endpoint"),
              scopes: translatedScopes,
              type: "oauth2",
              openIdConnectUrl: definition.get("openIdConnectUrl")
            })

            list = list.push(new Map({
              [defName]: translatedDef.filter((v) => {
                // filter out unset values, sometimes `authorizationUrl`
                // and `tokenUrl` come out as `undefined` in the data
                return v !== undefined
              })
            }))
          })
        }
      })

      return list
    }
))
