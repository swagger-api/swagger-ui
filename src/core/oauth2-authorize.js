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

  const url = processUrl(schema.get("authorizationUrl"), authConfigs, query)

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

function processUrl(url, authConfigs, query=[]) {
  let result = url || ""
  if (authConfigs) {
    if (authConfigs.realm) {
      const placeholder = "{realm}"
      const idx = url ? url.indexOf(placeholder) : -1
      if (idx !== -1) {
        result = url.substring(0, idx) + encodeURIComponent(authConfigs.realm) + url.substring(idx + placeholder.length)
      } else {
        query.push("realm=" + encodeURIComponent(authConfigs.realm))
      }
    }
    const params = authConfigs.additionalQueryStringParams || {}
    for (let key in params) {
      if (params[key] !== undefined) {
        query.push([key, params[key]].map(encodeURIComponent).join("="))
      }
    }
    if (query.length) {
      result += (result.indexOf("?") === -1 ? "?" : "&") + query.join("&")
    }
  }
  return result
}

export { processUrl }
