const translator = require("./translator")
const indent = require("./helpers").indent

const oauthBlockSchema = {
  OAUTH_CLIENT_ID: {
    type: "string",
    name: "clientId"
  },
  OAUTH_CLIENT_SECRET: {
    type: "string",
    name: "clientSecret",
    onFound: () => console.warn("Swagger UI warning: don't use `OAUTH_CLIENT_SECRET` in production!")
  },
  OAUTH_REALM: {
    type: "string",
    name: "realm"
  },
  OAUTH_APP_NAME: {
    type: "string",
    name: "appName"
  },
  OAUTH_SCOPE_SEPARATOR: {
    type: "string",
    name: "scopeSeparator"
  },
  OAUTH_ADDITIONAL_PARAMS: {
    type: "object",
    name: "additionalQueryStringParams"
  },
  OAUTH_USE_PKCE: {
    type: "boolean",
    name: "usePkceWithAuthorizationCodeGrant"
  },
  OAUTH_DEFAULT_SCOPE: {
    type: "array",
    name: "defaultScope"
  },
  OAUTH_HIDE_CLIENT_ID: {
    type: "boolean",
    name: "hideClientId"
  },
  OAUTH_HIDE_CLIENT_SECRET: {
    type: "boolean",
    name: "hideClientSecret"
  },
  OAUTH_HIDE_SCOPE: {
    type: "boolean",
    name: "hideScope"
  },
  OAUTH_HIDE_INFO: {
    type: "boolean",
    name: "hideInfo"
  }
}

module.exports = function oauthBlockBuilder(env) {
  const translatorResult = translator(env, { schema: oauthBlockSchema })

  if(translatorResult) {
    return (
      `ui.initOAuth({
${indent(translatorResult, 2)}
})`)
  }

  return ``
}
