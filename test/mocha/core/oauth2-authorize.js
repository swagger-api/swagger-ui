/* eslint-env mocha */
import expect, { createSpy } from "expect"
import win from "core/window"
import oauth2Authorize from "core/oauth2-authorize"
import jsrsasign from "jsrsasign"

describe("oauth2", function () {

  let mockSchema = {
    flow: "accessCode",
    authorizationUrl: "https://testAuthorizationUrl"
  }

  let authConfig = {
    auth: { schema: { get: (key)=> mockSchema[key] } }, 
    authActions: {}, 
    errActions: {}, 
    configs: { oauth2RedirectUrl: "" }, 
    authConfigs: {}
  }

  describe("authorize redirect", function () {

    it("should build authorize url", function() {
      win.open = createSpy()
      oauth2Authorize(authConfig)
      expect(win.open.calls.length).toEqual(1)
      expect(win.open.calls[0].arguments[0]).toMatch("https://testAuthorizationUrl?response_type=code&redirect_uri=&state=")
    })

    it("should append query parameters to authorizeUrl with query parameters", function() {
      win.open = createSpy()
      mockSchema.authorizationUrl = "https://testAuthorizationUrl?param=1"
      oauth2Authorize(authConfig)
      expect(win.open.calls.length).toEqual(1)
      expect(win.open.calls[0].arguments[0]).toMatch("https://testAuthorizationUrl?param=1&response_type=code&redirect_uri=&state=")
    })

    it("should send PKCE code_challenge when using authorizationCode flow with usePkceWithAuthorizationCodeGrant enabled", function () {
      win.open = createSpy()
      mockSchema.flow = "authorizationCode"

      const expectedCodeChallenge = "mock_code_challenge"
      jsrsasign.hextob64u = createSpy().andReturn(expectedCodeChallenge)

      authConfig.authConfigs.usePkceWithAuthorizationCodeGrant = true

      oauth2Authorize(authConfig)
      expect(win.open.calls.length).toEqual(1)

      const actualUrl = new URLSearchParams(win.open.calls[0].arguments[0])
      expect(actualUrl.get("code_challenge")).toBe(expectedCodeChallenge)
      expect(actualUrl.get("code_challenge_method")).toBe("S256")
      // the code_verifier needs to have a minimum length of 43
      // source: https://tools.ietf.org/html/rfc7636#section-4.1
      expect(authConfig.auth.codeVerifier.length).toBeGreaterThanOrEqualTo(43)
    })
  })
})
