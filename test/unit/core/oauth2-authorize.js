
import win from "core/window"
import oauth2Authorize from "core/oauth2-authorize"
import * as utils from "core/utils"

describe("oauth2", () => {

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

  beforeEach(() => {
    win.open = jest.fn()
  })

  describe("authorize redirect", () => {
    it("should build authorize url", () => {
      const windowOpenSpy = jest.spyOn(win, "open")
      oauth2Authorize(authConfig)
      expect(windowOpenSpy.mock.calls.length).toEqual(1)
      expect(windowOpenSpy.mock.calls[0][0]).toMatch("https://testAuthorizationUrl?response_type=code&redirect_uri=&state=")

      windowOpenSpy.mockReset()
    })

    it("should append query parameters to authorizeUrl with query parameters", () => {
      const windowOpenSpy = jest.spyOn(win, "open")
      mockSchema.authorizationUrl = "https://testAuthorizationUrl?param=1"
      oauth2Authorize(authConfig)
      expect(windowOpenSpy.mock.calls.length).toEqual(1)
      expect(windowOpenSpy.mock.calls[0][0]).toMatch("https://testAuthorizationUrl?param=1&response_type=code&redirect_uri=&state=")
      
      windowOpenSpy.mockReset()
    })

    it("should send code_challenge when using authorizationCode flow with usePkceWithAuthorizationCodeGrant enabled", () => {
      const windowOpenSpy = jest.spyOn(win, "open")
      mockSchema.flow = "authorizationCode"

      const expectedCodeVerifier = "mock_code_verifier"
      const expectedCodeChallenge = "mock_code_challenge"
      
      const generateCodeVerifierSpy = jest.spyOn(utils, "generateCodeVerifier").mockImplementation(() => expectedCodeVerifier)
      const createCodeChallengeSpy = jest.spyOn(utils, "createCodeChallenge").mockImplementation(() => expectedCodeChallenge)

      authConfig.authConfigs.usePkceWithAuthorizationCodeGrant = true

      oauth2Authorize(authConfig)
      expect(win.open.mock.calls.length).toEqual(1)

      const actualUrl = new URLSearchParams(win.open.mock.calls[0][0])
      expect(actualUrl.get("code_challenge")).toBe(expectedCodeChallenge)
      expect(actualUrl.get("code_challenge_method")).toBe("S256")

      expect(createCodeChallengeSpy.mock.calls.length).toEqual(1)
      expect(createCodeChallengeSpy.mock.calls[0][0]).toBe(expectedCodeVerifier)

      // The code_verifier should be stored to be able to send in
      // on the TokenUrl call
      expect(authConfig.auth.codeVerifier).toBe(expectedCodeVerifier)

      // Restore spies
      windowOpenSpy.mockReset()
      generateCodeVerifierSpy.mockReset()
      createCodeChallengeSpy.mockReset()
    })    
  })
})
