import jwtDecode from "jwt-decode"
import urljoin from "url-join"

import { exchangeToken } from "../../core/plugins/auth/actions"

export const newSamlAuthErr = (samlError) =>
    async ({ authActions, errActions, authSelectors, specSelectors }) => {
  const authorizableDefinitions = authSelectors.definitionsToAuthorize()
  const [authId] = specSelectors.samlSchemaEntry()

  // show the auth popup to display error
  authActions.showDefinitions(authorizableDefinitions)
  errActions.newAuthErr({
    authId,
    level: "",
    source: "auth",
    message: samlError
  })
}

export const authenticateWithSamlToken = (authId, schema, samlToken, done) =>
    ( { fn, samlAuthActions, authActions, specSelectors } ) => {

  // 1. decode jwt
  let decoded
  try {
    decoded = jwtDecode(samlToken)
  } catch(decodeErr) {
    samlAuthActions.newSamlAuthErr(`SAML token error. ${decodeErr.message}`)
    done()
    return
  }

  // 2. send request, parse response
  exchangeToken(fn, specSelectors, { email: decoded.sub, saml_token: samlToken })
  .then((token) => {
    authActions.authorize({
      [authId]: {
        name: authId,
        email: decoded.sub,
        token,
        schema
      }
    })
  })
  .catch((e) => {
    const errMessage = e.response && e.response.body
    ? e.response.body.message // prioritise response error
    : e.message // normal error message

    samlAuthActions.newSamlAuthErr(`Unauthorized. ${errMessage}`)
  })
  .finally(done)
}

export const loginSaml = () => async ({ specSelectors }) => {
  const loginUrl = `${specSelectors.service()}/saml/sso`
  const redirectUrl = encodeURIComponent(window.location.href)

  window.location.href = urljoin(loginUrl, `?RelayState=${redirectUrl}`)
}

export const logoutSaml = (name) =>
    async ( { authSelectors, specSelectors } ) => {
  const logoutUrl = `${specSelectors.service()}/saml/slo`
  const redirectUrl = encodeURIComponent(window.location.href)
  const email = authSelectors.authorized().getIn([name, "email"])

  window.location.href = urljoin(logoutUrl, `?email=${email}&RelayState=${redirectUrl}`)
}
