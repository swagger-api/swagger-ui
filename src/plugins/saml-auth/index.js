import SamlAuth from "./components/SamlAuth"
import AuthorizationPopup from "./components/AuthorizationPopup"
import * as actions from "./actions"
import { Map } from "immutable"
import { createSelector } from "reselect"

import "./saml-auth.css"

let engaged = false
const samlAuthPlugin = () => {
  return {
    components: {
      samlAuth: SamlAuth,
      authorizationPopup: AuthorizationPopup
    },
    // authorize on saml response.
    // refer to https://github.com/swagger-api/swagger-ui/blob/master/src/core/plugins/on-complete/index.js
    statePlugins: {
      samlAuth: {
        actions
      },
      spec: {
        selectors: {
          samlSchemaEntry: createSelector(
            state => state || Map(),
            spec => {
              const schemaKey = spec.getIn(["resolved", "securityDefinitions"], Map()).findKey((v) => v.get("saml"))
              const schema = spec.getIn(["resolved", "securityDefinitions", schemaKey])

              return schemaKey ? [schemaKey, schema] : undefined
            }
          )
        },
        wrapActions: {
          updateSpec:
            (ori, system) =>
            (...args) => {
              engaged = true

              const { specActions } = system
              // 1. maintain loading state until url is checked
              specActions.updateLoadingStatus("loading")
              return ori(...args)
            },
          updateJsonSpec:
            (ori, system) =>
            (...args) => {
              const authorize = () => {
                const { samlAuthActions, specActions, specSelectors } = system
                const [authId, schema] = specSelectors.samlSchemaEntry()

                const urlParams = new URLSearchParams(window.location.search)
                const samlToken = urlParams.get("SAMLToken")
                const samlError = urlParams.get("SAMLError")

                if(samlError || samlToken)
                  window.history.pushState({}, document.title, window.location.pathname)

                if(samlError) {
                  samlAuthActions.newSamlAuthErr(samlError)
                }
                else if(samlToken) {
                  samlAuthActions.authenticateWithSamlToken(
                    authId,
                    schema,
                    samlToken,
                    () => specActions.updateLoadingStatus("success")
                  )
                  return
                }
                specActions.updateLoadingStatus("success")
              }

              if (engaged) {
                setTimeout(authorize, 0)
                engaged = false
              }
              return ori(...args)
            },
        },
      },
    },
  }
}

export default samlAuthPlugin
