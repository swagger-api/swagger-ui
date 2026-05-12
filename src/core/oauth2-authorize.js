import parseUrl from "url-parse"
import Im from "immutable"
import { btoa, generateCodeVerifier, createCodeChallenge } from "core/utils"
import { sanitizeUrl } from "core/utils/url"

export default function authorize ( { auth, authActions, errActions, configs, authConfigs={}, currentServer } ) {
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

    case "clientCredentials":
    case "client_credentials":
      // OAS3
      authActions.authorizeApplication(auth)
      return

    case "authorizationCode":
    case "authorization_code":
      // OAS3
      query.push("response_type=code")
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
      message: "oauth2RedirectUrl configuration is not passed. Oauth2 authorization cannot be performed."
    })
    return
  }
  query.push("redirect_uri=" + encodeURIComponent(redirectUrl))

  let scopesArray = []
  if (Array.isArray(scopes)) {
    scopesArray = scopes
  } else if (Im.List.isList(scopes)) {
    scopesArray = scopes.toArray()
  }

  if (scopesArray.length > 0) {
    let scopeSeparator = authConfigs.scopeSeparator || " "

    query.push("scope=" + encodeURIComponent(scopesArray.join(scopeSeparator)))
  }

  let state = btoa(new Date())

  query.push("state=" + encodeURIComponent(state))

  if (typeof authConfigs.realm !== "undefined") {
    query.push("realm=" + encodeURIComponent(authConfigs.realm))
  }

  if ((flow === "authorizationCode" || flow === "authorization_code" || flow === "accessCode") && authConfigs.usePkceWithAuthorizationCodeGrant) {
      const codeVerifier = generateCodeVerifier()
      const codeChallenge = createCodeChallenge(codeVerifier)

      query.push("code_challenge=" + codeChallenge)
      query.push("code_challenge_method=S256")

      // storing the Code Verifier so it can be sent to the token endpoint
      // when exchanging the Authorization Code for an Access Token
      auth.codeVerifier = codeVerifier
  }

  let { additionalQueryStringParams } = authConfigs

  for (let key in additionalQueryStringParams) {
    if (typeof additionalQueryStringParams[key] !== "undefined") {
      query.push([key, additionalQueryStringParams[key]].map(encodeURIComponent).join("="))
    }
  }

  const authorizationUrl = schema.get("authorizationUrl")
  let sanitizedAuthorizationUrl
  if (currentServer) {
    // OpenAPI 3
    sanitizedAuthorizationUrl = parseUrl(
      sanitizeUrl(authorizationUrl),
      currentServer,
      true
    ).toString()
  } else {
    sanitizedAuthorizationUrl = sanitizeUrl(authorizationUrl)
  }
  let url = [sanitizedAuthorizationUrl, query.join("&")].join(
    typeof authorizationUrl === "string" && !authorizationUrl.includes("?")
      ? "?"
      : "&"
  )

  // pass action authorizeOauth2 and authentication data through window
  // to authorize with oauth2

  let callback
  if (flow === "implicit") {
    callback = authActions.preAuthorizeImplicit
  } else if (authConfigs.useBasicAuthenticationWithAccessCodeGrant) {
    callback = authActions.authorizeAccessCodeWithBasicAuthentication
  } else {
    callback = authActions.authorizeAccessCodeWithFormParams
  }

  authActions.authPopup(url, {
    auth: auth,
    state: state,
    redirectUrl: redirectUrl,
    callback: callback,
    errCb: errActions.newAuthErr
  })
}
