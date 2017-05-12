import win from "core/window"
import { btoa } from "core/utils"

export default function authorize ( { auth, authActions, errActions, configs, authConfigs={} } ) {
  let { schema, scopes, name, clientId } = auth

  let { additionalQueryStringParams } = authConfigs
  let redirectUrl = configs.oauth2RedirectUrl
  let scopeSeparator = authConfigs.scopeSeparator || " "
  let state = btoa(new Date())
  let flow = schema.get("flow")
  let url

  if (flow === "password") {
    authActions.authorizePassword(auth)
    return
  }

  if (flow === "application") {
    authActions.authorizeApplication(auth)
    return
  }

  // todo move to parser
  if ( !redirectUrl ) {
    errActions.newAuthErr( {
      authId: name,
      source: "validation",
      level: "error",
      message: "oauth2RedirectUrl configuration is not passed. Oauth2 authorization cannot be performed."
    })
    return
  }

  if (flow === "implicit" || flow === "accessCode") {
    url = schema.get("authorizationUrl") + "?response_type=" + (flow === "implicit" ? "token" : "code")
  }

  url += "&redirect_uri=" + encodeURIComponent(redirectUrl)
      + "&realm=" + encodeURIComponent(authConfigs.realm);
      + "&scope=" + encodeURIComponent(scopes.join(scopeSeparator))
      + "&state=" + encodeURIComponent(state)
      + "&client_id=" + encodeURIComponent(clientId)

  for (let key in additionalQueryStringParams) {
    url += "&" + key + "=" + encodeURIComponent(additionalQueryStringParams[key])
  }

  // pass action authorizeOauth2 and authentication data through window
  // to authorize with oauth2
  win.swaggerUIRedirectOauth2 = {
    auth: auth,
    state: state,
    callback: flow === "implicit" ? authActions.preAuthorizeImplicit : authActions.authorizeAccessCode,
    errCb: errActions.newAuthErr
  }

  win.open(url)
}
