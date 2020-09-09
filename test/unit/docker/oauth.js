const oauthBlockBuilder = require("../../../docker/configurator/oauth")
const dedent = require("dedent")

describe("docker: env translator - oauth block", function() {
  it("should omit the block if there are no valid keys", function () {
    const input = {}

    expect(oauthBlockBuilder(input)).toEqual(``)
  })
  it("should omit the block if there are no valid keys", function () {
    const input = {
      NOT_A_VALID_KEY: "asdf1234"
    }

    expect(oauthBlockBuilder(input)).toEqual(``)
  })
  it("should generate a block from empty values", function() {
    const input = {
      OAUTH_CLIENT_ID: ``,
      OAUTH_CLIENT_SECRET: ``,
      OAUTH_REALM: ``,
      OAUTH_APP_NAME: ``,
      OAUTH_SCOPE_SEPARATOR: "",
      OAUTH_ADDITIONAL_PARAMS: ``,
      OAUTH_USE_PKCE: false
    }

    expect(oauthBlockBuilder(input)).toEqual(dedent(`
    ui.initOAuth({
      clientId: "",
      clientSecret: "",
      realm: "",
      appName: "",
      scopeSeparator: "",
      additionalQueryStringParams: undefined,
      usePkceWithAuthorizationCodeGrant: false,
    })`))
  })

  it("should generate a full block", function() {
    const input = {
      OAUTH_CLIENT_ID: `myId`,
      OAUTH_CLIENT_SECRET: `mySecret`,
      OAUTH_REALM: `myRealm`,
      OAUTH_APP_NAME: `myAppName`,
      OAUTH_SCOPE_SEPARATOR: "%21",
      OAUTH_ADDITIONAL_PARAMS: `{ "a": 1234, "b": "stuff" }`,
      OAUTH_USE_PKCE: true
    }

    expect(oauthBlockBuilder(input)).toEqual(dedent(`
    ui.initOAuth({
      clientId: "myId",
      clientSecret: "mySecret",
      realm: "myRealm",
      appName: "myAppName",
      scopeSeparator: "%21",
      additionalQueryStringParams: { "a": 1234, "b": "stuff" },
      usePkceWithAuthorizationCodeGrant: true,
    })`))
  })
})
