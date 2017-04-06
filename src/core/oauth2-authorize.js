import win from "core/window"

export default function authorize ( auth, authActions, errActions, configs ) {
  let { schema, scopes, name, clientId } = auth

  let redirectUrl = configs.oauth2RedirectUrl
  let scopeSeparator = " "
  let state = name
  let flow = schema.get("flow")
  let url

  if (flow === "password") {
    authActions.authorizePassword(auth)
    return
  }

  if (flow === "application") {
    authActions.authorizeOauth2Application(auth)
    return
  }

  // todo move to parser
  if ( !redirectUrl ) {
    errActions.newAuthErr( {
      authId: name,
      source: "validation",
      level: "error",
      message: "oauth2RedirectUri configuration is not passed. Oauth2 authorization cannot be performed."
    })
    return
  }

  if (flow === "implicit" || flow === "accessCode") {
    url = schema.get("authorizationUrl") + "?response_type=" + (flow === "implicit" ? "token" : "code")
  }

  url += "&redirect_uri=" + encodeURIComponent(redirectUrl)
      + "&scope=" + encodeURIComponent(scopes.join(scopeSeparator))
      + "&state=" + encodeURIComponent(state)
      + "&client_id=" + encodeURIComponent(clientId)

  // pass action authorizeOauth2 and authentication data through window
  // to authorize with oauth2
  win.swaggerUIRedirectOauth2 = {
    auth: auth,
    state: state,
    callback: authActions.preAuthorizeOauth2,
    errCb: errActions.newAuthErr
  }

  win.open(url)
}
