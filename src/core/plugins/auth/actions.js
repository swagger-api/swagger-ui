import parseUrl from "url-parse"
import win from "core/window"
import { btoa, buildFormData } from "core/utils"

export const SHOW_AUTH_POPUP = "show_popup"
export const AUTHORIZE = "authorize"
export const LOGOUT = "logout"
export const PRE_AUTHORIZE_OAUTH2 = "pre_authorize_oauth2"
export const AUTHORIZE_OAUTH2 = "authorize_oauth2"
export const VALIDATE = "validate"
export const CONFIGURE_AUTH = "configure_auth"

const scopeSeparator = " "

export function showDefinitions(payload) {
  return {
    type: SHOW_AUTH_POPUP,
    payload: payload
  }
}

export function authorize(payload) {
  return {
    type: AUTHORIZE,
    payload: payload
  }
}

export function logout(payload) {
  return {
    type: LOGOUT,
    payload: payload
  }
}

export const preAuthorizeImplicit = (payload) => ( { authActions, errActions } ) => {
  let { auth , token, isValid } = payload
  let { schema, name } = auth
  let flow = schema.get("flow")

  // remove oauth2 property from window after redirect from authentication
  delete win.swaggerUIRedirectOauth2

  if ( flow !== "accessCode" && !isValid ) {
    errActions.newAuthErr( {
      authId: name,
      source: "auth",
      level: "warning",
      message: "Authorization may be unsafe, passed state was changed in server Passed state wasn't returned from auth server"
    })
  }

  if ( token.error ) {
    errActions.newAuthErr({
      authId: name,
      source: "auth",
      level: "error",
      message: JSON.stringify(token)
    })
    return
  }

  authActions.authorizeOauth2({ auth, token })
}

export function authorizeOauth2(payload) {
  return {
    type: AUTHORIZE_OAUTH2,
    payload: payload
  }
}

export const authorizePassword = ( auth ) => ( { authActions } ) => {
  let { schema, name, username, password, passwordType, clientId, clientSecret } = auth
  let form = {
    grant_type: "password",
    scope: auth.scopes.join(scopeSeparator),
    username,
    password
  }
  let query = {}
  let headers = {}

  switch (passwordType) {
    case "request-body":
      setClientIdAndSecret(form, clientId, clientSecret)
      break

    case "basic":
      headers.Authorization = "Basic " + btoa(clientId + ":" + clientSecret)
      break
    default:
      console.warn(`Warning: invalid passwordType ${passwordType} was passed, not including client id and secret`)
  }

  return authActions.authorizeRequest({ body: buildFormData(form), url: schema.get("tokenUrl"), name, headers, query, auth})
}

function setClientIdAndSecret(target, clientId, clientSecret) {
  if ( clientId ) {
    Object.assign(target, {client_id: clientId})
  }

  if ( clientSecret ) {
    Object.assign(target, {client_secret: clientSecret})
  }
}

export const authorizeApplication = ( auth ) => ( { authActions } ) => {
  let { schema, scopes, name, clientId, clientSecret } = auth
  let headers = {
    Authorization: "Basic " + btoa(clientId + ":" + clientSecret)
  }
  let form = {
    grant_type: "client_credentials",
    scope: scopes.join(scopeSeparator)
  }

  return authActions.authorizeRequest({body: buildFormData(form), name, url: schema.get("tokenUrl"), auth, headers })
}

export const authorizeAccessCodeWithFormParams = ( { auth, redirectUrl } ) => ( { authActions } ) => {
  let { schema, name, clientId, clientSecret, codeVerifier } = auth
  let form = {
    grant_type: "authorization_code",
    code: auth.code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUrl,
    code_verifier: codeVerifier
  }

  return authActions.authorizeRequest({body: buildFormData(form), name, url: schema.get("tokenUrl"), auth})
}

export const authorizeAccessCodeWithBasicAuthentication = ( { auth, redirectUrl } ) => ( { authActions } ) => {
  let { schema, name, clientId, clientSecret } = auth
  let headers = {
    Authorization: "Basic " + btoa(clientId + ":" + clientSecret)
  }
  let form = {
    grant_type: "authorization_code",
    code: auth.code,
    client_id: clientId,
    redirect_uri: redirectUrl
  }

  return authActions.authorizeRequest({body: buildFormData(form), name, url: schema.get("tokenUrl"), auth, headers})
}

export const authorizeRequest = ( data ) => ( { fn, getConfigs, authActions, errActions, oas3Selectors, specSelectors, authSelectors } ) => {
  let { body, query={}, headers={}, name, url, auth } = data

  let { additionalQueryStringParams } = authSelectors.getConfigs() || {}

  let parsedUrl

  if (specSelectors.isOAS3()) {
    parsedUrl = parseUrl(url, oas3Selectors.selectedServer(), true)
  } else {
    parsedUrl = parseUrl(url, specSelectors.url(), true)
  }

  if(typeof additionalQueryStringParams === "object") {
    parsedUrl.query = Object.assign({}, parsedUrl.query, additionalQueryStringParams)
  }

  const fetchUrl = parsedUrl.toString()

  let _headers = Object.assign({
    "Accept":"application/json, text/plain, */*",
    "Content-Type": "application/x-www-form-urlencoded",
    "X-Requested-With": "XMLHttpRequest"
  }, headers)

  fn.fetch({
    url: fetchUrl,
    method: "post",
    headers: _headers,
    query: query,
    body: body,
    requestInterceptor: getConfigs().requestInterceptor,
    responseInterceptor: getConfigs().responseInterceptor
  })
  .then(function (response) {
    let token = JSON.parse(response.data)
    let error = token && ( token.error || "" )
    let parseError = token && ( token.parseError || "" )

    if ( !response.ok ) {
      errActions.newAuthErr( {
        authId: name,
        level: "error",
        source: "auth",
        message: response.statusText
      } )
      return
    }

    if ( error || parseError ) {
      errActions.newAuthErr({
        authId: name,
        level: "error",
        source: "auth",
        message: JSON.stringify(token)
      })
      return
    }

    authActions.authorizeOauth2({ auth, token})
  })
  .catch(e => {
    let err = new Error(e)
    let message = err.message
    // swagger-js wraps the response (if available) into the e.response property;
    // investigate to check whether there are more details on why the authorization
    // request failed (according to RFC 6479).
    // See also https://github.com/swagger-api/swagger-ui/issues/4048
    if (e.response && e.response.data) {
      const errData = e.response.data
      try {
        const jsonResponse = typeof errData === "string" ? JSON.parse(errData) : errData
        if (jsonResponse.error)
          message += `, error: ${jsonResponse.error}`
        if (jsonResponse.error_description)
          message += `, description: ${jsonResponse.error_description}`
      } catch (jsonError) {
        // Ignore
      }
    }
    errActions.newAuthErr( {
      authId: name,
      level: "error",
      source: "auth",
      message: message
    } )
  })
}

export function configureAuth(payload) {
  return {
    type: CONFIGURE_AUTH,
    payload: payload
  }
}
