import win from "core/window"
import { btoa } from "core/utils"

export default function authorize ( { auth, authActions, errActions, configs, authConfigs={} } ) {
  let { schema, scopes, name, clientId } = auth
  let flow = schema.get("flow")
  let query = []

  switch (flow) {
    case "password":
      authActions.authorizePassword(auth)
      return

    case "application":
      authActions.authorizeApplication(auth)
      return

    case "accessCode":
      query.push("response_type=code")
      break

    case "implicit":
      query.push("response_type=token")
      break
  }

  if (typeof clientId === "string") {
    query.push("client_id=" + encodeURIComponent(clientId))
  }

  let redirectUrl = configs.oauth2RedirectUrl

  // todo move to parser
  if (typeof redirectUrl === "undefined") {
    errActions.newAuthErr( {
      authId: name,
      source: "validation",
      level: "error",
      message: "oauth2RedirectUri configuration is not passed. Oauth2 authorization cannot be performed."
    })
    return
  }
  query.push("redirect_uri=" + encodeURIComponent(redirectUrl))

  if (Array.isArray(scopes) && 0 < scopes.length) {
    let scopeSeparator = authConfigs.scopeSeparator || " "

    query.push("scope=" + encodeURIComponent(scopes.join(scopeSeparator)))
  }

  let state = btoa(new Date())

  query.push("state=" + encodeURIComponent(state))

  if (typeof authConfigs.realm !== "undefined") {
    query.push("realm=" + encodeURIComponent(authConfigs.realm))
  }

  let { additionalQueryStringParams } = authConfigs

  for (let key in additionalQueryStringParams) {
    if (typeof additionalQueryStringParams[key] !== "undefined") {
      query.push([key, additionalQueryStringParams[key]].map(encodeURIComponent).join("="))
    }
  }

  let url = [schema.get("authorizationUrl"), query.join("&")].join("?")

  // pass action authorizeOauth2 and authentication data through window
  // to authorize with oauth2
  win.swaggerUIRedirectOauth2 = {
    auth: auth,
    state: state,
    redirectUrl: redirectUrl,
    callback: flow === "implicit" ? authActions.preAuthorizeImplicit : authActions.authorizeAccessCode,
    errCb: errActions.newAuthErr
  }

  win.open(url)
}
