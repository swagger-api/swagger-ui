const translator = require("./translator")
const indent = require("./helpers").indent

const  oauthBlockSchema = {
  OAUTH_CLIENT_ID: {
    type: "string",
    name: "clientId"
  },
  OAUTH_CLIENT_SECRET: {
    type: "string",
    name: "clientSecret",
    onFound: () => console.warn("Notice: don't use `OAUTH_CLIENT_SECRET in production!")
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
  }
}

module.exports = function oauthBlockBuilder(env) {

  return (
`ui.initOAuth({
${indent( translator(env, { schema: oauthBlockSchema}), 2)}
})`)
}