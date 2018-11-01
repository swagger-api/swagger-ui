const expect = require("expect")
const oauthBlockBuilder = require("../../docker/configurator/oauth")
const dedent = require("dedent")

describe("docker: env translator - oauth block", function() {
  it("should generate an empty base block", function () {
    const input = {}

    expect(oauthBlockBuilder(input)).toEqual(`ui.initOAuth({\n  \n})`)
  })
  it("should generate a full block", function() {
    const input = {
      OAUTH_CLIENT_ID: `myId`,
      OAUTH_CLIENT_SECRET: `mySecret`,
      OAUTH_REALM: `myRealm`,
      OAUTH_APP_NAME: `myAppName`,
      OAUTH_SCOPE_SEPARATOR: "%21",
      OAUTH_ADDITIONAL_PARAMS: `{ "a": 1234, "b": "stuff" }`,
    }

    expect(oauthBlockBuilder(input)).toEqual(dedent(`
    ui.initOAuth({
      clientId: "myId",
      clientSecret: "mySecret",
      realm: "myRealm",
      appName: "myAppName",
      scopeSeparator: "%21",
      additionalQueryStringParams: { "a": 1234, "b": "stuff" },
    })`))
  })
})