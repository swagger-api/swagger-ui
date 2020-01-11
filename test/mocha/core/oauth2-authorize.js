/* eslint-env mocha */
import expect, { spyOn } from "expect"
import win from "core/window"
import oauth2Authorize from "core/oauth2-authorize"
import * as utils from "core/utils"

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
      const windowOpenSpy = spyOn(win, "open")
      oauth2Authorize(authConfig)
      expect(windowOpenSpy.calls.length).toEqual(1)
      expect(windowOpenSpy.calls[0].arguments[0]).toMatch("https://testAuthorizationUrl?response_type=code&redirect_uri=&state=")

      windowOpenSpy.restore()
    })

    it("should append query parameters to authorizeUrl with query parameters", function() {
      const windowOpenSpy = spyOn(win, "open")
      mockSchema.authorizationUrl = "https://testAuthorizationUrl?param=1"
      oauth2Authorize(authConfig)
      expect(windowOpenSpy.calls.length).toEqual(1)
      expect(windowOpenSpy.calls[0].arguments[0]).toMatch("https://testAuthorizationUrl?param=1&response_type=code&redirect_uri=&state=")
      
      windowOpenSpy.restore()
    })

    it("should send code_challenge when using authorizationCode flow with usePkceWithAuthorizationCodeGrant enabled", function () {
      const windowOpenSpy = spyOn(win, "open")
      mockSchema.flow = "authorizationCode"

      const expectedCodeVerifier = "mock_code_verifier"
      const expectedCodeChallenge = "mock_code_challenge"
      
      const generateCodeVerifierSpy = spyOn(utils, "generateCodeVerifier").andReturn(expectedCodeVerifier)
      const createCodeChallengeSpy = spyOn(utils, "createCodeChallenge").andReturn(expectedCodeChallenge)

      authConfig.authConfigs.usePkceWithAuthorizationCodeGrant = true

      oauth2Authorize(authConfig)
      expect(win.open.calls.length).toEqual(1)

      const actualUrl = new URLSearchParams(win.open.calls[0].arguments[0])
      expect(actualUrl.get("code_challenge")).toBe(expectedCodeChallenge)
      expect(actualUrl.get("code_challenge_method")).toBe("S256")

      expect(createCodeChallengeSpy.calls.length).toEqual(1)
      expect(createCodeChallengeSpy.calls[0].arguments[0]).toBe(expectedCodeVerifier)

      // The code_verifier should be stored to be able to send in
      // on the TokenUrl call
      expect(authConfig.auth.codeVerifier).toBe(expectedCodeVerifier)

      // Restore spies
      windowOpenSpy.restore()
      generateCodeVerifierSpy.restore()
      createCodeChallengeSpy.restore()
    })    
  })
})
