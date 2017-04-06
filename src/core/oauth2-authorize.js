import win from "core/window"

export default function authorize ( auth, authActions, errActions, configs ) {
  let { schema, scopes, name, clientId, clientSecret } = auth

  let redirectUrl = configs.oauth2RedirectUrl
  let scopeSeparator = " "
  let state = name
  let flow = schema.get("flow")
  let url

  if (flow === "password") {
    authActions.authorizePassword(auth)
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

  if (flow === "application") {
    fetch(schema.get("tokenUrl"), {
      method: "post", headers: {
        "Accept":"application/json, text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "grant_type=client_credentials" +
            "&client_id=" + encodeURIComponent(clientId) +
            "&client_secret=" + encodeURIComponent(clientSecret) +
            "&scope=" + encodeURIComponent(scopes.join(scopeSeparator))
    })
    .then(function (response) {
      response.json()
      .then(function (json){
        authActions.authorizeOauth2({ auth, token: json })
      })
    })
    .catch (function (error) {
      console.log("POST Request failed", error)
    })
  } else {
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
}
