import parseUrl from "url-parse"
import Im from "immutable"
import { btoa, sanitizeUrl, generateCodeVerifier, createCodeChallenge } from "core/utils"

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
  let url = [sanitizedAuthorizationUrl, query.join("&")].join(authorizationUrl.indexOf("?") === -1 ? "?" : "&")

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

  const oauth2 = {
    auth: auth,
    state: state,
    redirectUrl: redirectUrl,
    callback: callback,
    errCb: errActions.newAuthErr,
    handleAuth: (qp) => {
      const isValid = qp.state === oauth2.state

      if ((
        oauth2.auth.schema.get("flow") === "accessCode" ||
        oauth2.auth.schema.get("flow") === "authorizationCode" ||
        oauth2.auth.schema.get("flow") === "authorization_code"
      ) && !oauth2.auth.code) {
          if (!isValid) {
              oauth2.errCb({
                  authId: oauth2.auth.name,
                  source: "auth",
                  level: "warning",
                  message: "Authorization may be unsafe, passed state was changed in server Passed state wasn't returned from auth server"
              })
          }

          if (qp.code) {
              delete oauth2.state
              oauth2.auth.code = qp.code
              oauth2.callback({auth: oauth2.auth, redirectUrl: redirectUrl})
          } else {
              let oauthErrorMsg
              if (qp.error) {
                  oauthErrorMsg = "["+qp.error+"]: " +
                      (qp.error_description ? qp.error_description+ ". " : "no accessCode received from the server. ") +
                      (qp.error_uri ? "More info: "+qp.error_uri : "")
              }

              oauth2.errCb({
                  authId: oauth2.auth.name,
                  source: "auth",
                  level: "error",
                  message: oauthErrorMsg || "[Authorization failed]: no accessCode received from the server"
              })
          }
      } else {
          oauth2.callback({auth: oauth2.auth, token: qp, isValid: isValid, redirectUrl: redirectUrl})
      }
    }
  }

  authActions.authPopup(url, oauth2)
}
