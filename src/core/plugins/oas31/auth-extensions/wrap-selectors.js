/**
 * @prettier
 */
import { fromJS, Map, List } from "immutable"
import { createOnlyOAS31SelectorWrapper } from "../fn"

export const selectLicenseUrl = createOnlyOAS31SelectorWrapper(
  () => (oriSelector, system) => {
    return system.oas31Selectors.selectLicenseUrl()
  }
)

export const definitionsToAuthorize = createOnlyOAS31SelectorWrapper(
  () => (oriSelector, system) => {
    const definitions = system.getSystem().specSelectors.securityDefinitions()
    let list = List()

    if (!definitions) {
      return list
    }

    definitions.entrySeq().forEach(([defName, definition]) => {
      const type = definition.get("type")
      if (type === "oauth2") {
        definition
          .get("flows")
          .entrySeq()
          .forEach(([flowKey, flowVal]) => {
            let translatedDef = fromJS({
              flow: flowKey,
              authorizationUrl: flowVal.get("authorizationUrl"),
              tokenUrl: flowVal.get("tokenUrl"),
              scopes: flowVal.get("scopes"),
              type: definition.get("type"),
              description: definition.get("description"),
            })
            const w1 = new Map({
              [defName]: translatedDef.filter((v) => {
                // filter out unset values, sometimes `authorizationUrl`
                // and `tokenUrl` come out as `undefined` in the data
                return v !== undefined
              }),
            })
            list = list.push(w1)
          })
      }
      if (type === "http" || type === "apiKey") {
        list = list.push(
          new Map({
            [defName]: definition,
          })
        )
      }
      if (type === "openIdConnect" && definition.get("openIdConnectData")) {
        let oidcData = definition.get("openIdConnectData")
        let grants = oidcData.get("grant_types_supported") || [
          "authorization_code",
          "implicit",
        ]
        grants.forEach((grant) => {
          // Convert from OIDC list of scopes to the OAS-style map with empty descriptions
          let translatedScopes =
            oidcData.get("scopes_supported") &&
            oidcData
              .get("scopes_supported")
              .reduce((acc, cur) => acc.set(cur, ""), new Map())

          let translatedDef = fromJS({
            flow: grant,
            authorizationUrl: oidcData.get("authorization_endpoint"),
            tokenUrl: oidcData.get("token_endpoint"),
            scopes: translatedScopes,
            type: "oauth2",
            openIdConnectUrl: definition.get("openIdConnectUrl"),
          })

          list = list.push(
            new Map({
              [defName]: translatedDef.filter((v) => {
                // filter out unset values, sometimes `authorizationUrl`
                // and `tokenUrl` come out as `undefined` in the data
                return v !== undefined
              }),
            })
          )
        })
      }

      if (type === "mutualTLS") {
        list = list.push(
          new Map({
            [defName]: definition,
          })
        )
      }
    })
    return list
  }
)
