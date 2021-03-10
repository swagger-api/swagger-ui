
import win from "core/window"
import Im from "immutable"
import oauth2Authorize from "core/oauth2-authorize"
import * as utils from "core/utils"

describe("oauth2", () => {

  let mockSchema = {
    flow: "accessCode",
    authorizationUrl: "https://testAuthorizationUrl"
  }

  let authConfig = {
    auth: { schema: { get: (key)=> mockSchema[key] }, scopes: ["scope1", "scope2"] },
    authActions: {},
    errActions: {},
    configs: { oauth2RedirectUrl: "" },
    authConfigs: {}
  }

  let authConfig2 = {
    auth: { schema: { get: (key)=> mockSchema[key] }, scopes: Im.List(["scope2","scope3"]) },
    authActions: {},
    errActions: {},
    configs: { oauth2RedirectUrl: "" },
    authConfigs: {}
  }

  let authConfig3 = {
    auth: { schema: { get: (key)=> mockSchema[key] }, scopes: Im.List(["scope4","scope5"]) },
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
      expect(windowOpenSpy.mock.calls[0][0]).toMatch("https://testAuthorizationUrl?response_type=code&redirect_uri=&scope=scope1%20scope2&state=")

      windowOpenSpy.mockReset()
    })

    it("should build authorize url relative", function () {
      const windowOpenSpy = jest.spyOn(win, "open")
      let relativeMockSchema = {
        flow: "accessCode",
        authorizationUrl: "/testAuthorizationUrl"
      }
      let relativeAuthConfig = {
        auth: { schema: { get: (key) => relativeMockSchema[key] } },
        authActions: {},
        errActions: {},
        configs: { oauth2RedirectUrl: "" },
        authConfigs: {},
        currentServer: "https://currentserver"
      }
      oauth2Authorize(relativeAuthConfig)
      expect(windowOpenSpy.mock.calls.length).toEqual(1)
      expect(windowOpenSpy.mock.calls[0][0]).toMatch("https://currentserver/testAuthorizationUrl?response_type=code&redirect_uri=&state=")

      windowOpenSpy.mockReset()
    })

    it("should append query parameters to authorizeUrl with query parameters", () => {
      const windowOpenSpy = jest.spyOn(win, "open")
      mockSchema.authorizationUrl = "https://testAuthorizationUrl?param=1"
      oauth2Authorize(authConfig)
      expect(windowOpenSpy.mock.calls.length).toEqual(1)
      expect(windowOpenSpy.mock.calls[0][0]).toMatch("https://testAuthorizationUrl?param=1&response_type=code&redirect_uri=&scope=scope1%20scope2&state=")

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


    it("should send code_challenge when using accessCode flow with usePkceWithAuthorizationCodeGrant enabled", () => {
      const windowOpenSpy = jest.spyOn(win, "open")
      mockSchema.flow = "accessCode"

      const expectedCodeVerifier = "mock_code_verifier"
      const expectedCodeChallenge = "mock_code_challenge"

      const generateCodeVerifierSpy = jest.spyOn(utils, "generateCodeVerifier").mockImplementation(() => expectedCodeVerifier)
      const createCodeChallengeSpy = jest.spyOn(utils, "createCodeChallenge").mockImplementation(() => expectedCodeChallenge)

      authConfig.authConfigs.useBasicAuthenticationWithAccessCodeGrant = true
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

    it("should send code_challenge when using authorization_code flow with usePkceWithAuthorizationCodeGrant enabled", () => {
      const windowOpenSpy = jest.spyOn(win, "open")
      mockSchema.flow = "authorization_code"

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

    it("should add list of scopes to authorizeUrl", () => {
      const windowOpenSpy = jest.spyOn(win, "open")
      mockSchema.authorizationUrl = "https://testAuthorizationUrl?param=1"

      oauth2Authorize(authConfig2)
      expect(windowOpenSpy.mock.calls.length).toEqual(1)
      expect(windowOpenSpy.mock.calls[0][0]).toMatch("https://testAuthorizationUrl?param=1&response_type=code&redirect_uri=&scope=scope2%20scope3&state=")

      windowOpenSpy.mockReset()
    })

    it("should build authorize url for authorization_code flow", () => {
      const windowOpenSpy = jest.spyOn(win, "open")
      mockSchema.authorizationUrl = "https://testAuthorizationUrl"
      mockSchema.flow = "authorization_code"

      oauth2Authorize(authConfig3)
      expect(windowOpenSpy.mock.calls.length).toEqual(1)
      expect(windowOpenSpy.mock.calls[0][0]).toMatch("https://testAuthorizationUrl?response_type=code&redirect_uri=&scope=scope4%20scope5&state=")

      windowOpenSpy.mockReset()
    })
  })
})
