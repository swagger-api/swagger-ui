import win from "core/window"
import { btoa } from "core/utils"

export const SHOW_AUTH_POPUP = "show_popup"
export const AUTHORIZE = "authorize"
export const LOGOUT = "logout"
export const PRE_AUTHORIZE_OAUTH2 = "pre_authorize_oauth2"
export const AUTHORIZE_OAUTH2 = "authorize_oauth2"
export const VALIDATE = "validate"

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

export const preAuthorizeOauth2 = (payload) => ( { authActions, errActions } ) => {
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

export const authorizePassword = ( auth ) => ( { fn, authActions, errActions } ) => {
  let { schema, name, username, password, passwordType, clientId, clientSecret } = auth
  let req = {
    url: schema.get("tokenUrl"),
    method: "post",
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    },
    query: {
      grant_type: "password",
      username,
      password,
      scopes: encodeURIComponent(auth.scopes.join(scopeSeparator))
    }
  }

  if ( passwordType === "basic") {
    req.headers.authorization = "Basic " + btoa(clientId + ":" + clientSecret)
  } else if ( passwordType === "request") {
    req.query = Object.assign(req.query, { client_id: clientId, client_secret: clientSecret })
  }
  return fn.fetch(req)
    .then(( response ) => {
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

      authActions.authorizeOauth2({ auth, token })
    })
    .catch(err => { errActions.newAuthErr( err ) })
}

export const authorizeOauth2Application = ( auth ) => ( { fn, authActions, errActions } ) => {
  let { schema, scopes, name, clientId, clientSecret } = auth

  fn.fetch(schema.get("tokenUrl"), {
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
    if ( !response.ok ) {
      errActions.newAuthErr( {
        authId: name,
        level: "error",
        source: "auth",
        message: response.statusText
      } )
      return
    } else {
      response.json()
      .then(function (json){
        authActions.authorizeOauth2({ auth, token: json})
      })
    }
  })
  .catch(err => { errActions.newAuthErr( err ) })
}
