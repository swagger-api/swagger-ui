
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
    authActions: {
      authPopup: jest.fn()
    },
    errActions: {},
    configs: { oauth2RedirectUrl: "" },
    authConfigs: {}
  }

  let authConfig2 = {
    auth: { schema: { get: (key)=> mockSchema[key] }, scopes: Im.List(["scope2","scope3"]) },
    authActions: {
      authPopup: jest.fn()
    },
    errActions: {},
    configs: { oauth2RedirectUrl: "" },
    authConfigs: {}
  }

  let authConfig3 = {
    auth: { schema: { get: (key)=> mockSchema[key] }, scopes: Im.List(["scope4","scope5"]) },
    authActions: {
      authPopup: jest.fn()
    },
    errActions: {},
    configs: { oauth2RedirectUrl: "" },
    authConfigs: {}
  }

  describe("authorize redirect", () => {
    it("should build authorize url", () => {
      oauth2Authorize(authConfig)
      expect(authConfig.authActions.authPopup.mock.calls.length).toEqual(1)
      expect(authConfig.authActions.authPopup.mock.calls[0][0]).toMatch("https://testauthorizationurl/?response_type=code&redirect_uri=&scope=scope1%20scope2&state=")

      authConfig.authActions.authPopup.mockReset()
    })

    it("should build authorize url relative", function () {
      let relativeMockSchema = {
        flow: "accessCode",
        authorizationUrl: "/testAuthorizationUrl"
      }
      let relativeAuthConfig = {
        auth: { schema: { get: (key) => relativeMockSchema[key] } },
        authActions: {
          authPopup: jest.fn()
        },
        errActions: {},
        configs: { oauth2RedirectUrl: "" },
        authConfigs: {},
        currentServer: "https://currentserver"
      }
      oauth2Authorize(relativeAuthConfig)
      expect(relativeAuthConfig.authActions.authPopup.mock.calls.length).toEqual(1)
      expect(relativeAuthConfig.authActions.authPopup.mock.calls[0][0]).toMatch("https://currentserver/testAuthorizationUrl?response_type=code&redirect_uri=&state=")

      relativeAuthConfig.authActions.authPopup.mockReset()
    })

    it("should append query parameters to authorizeUrl with query parameters", () => {
      mockSchema.authorizationUrl = "https://testAuthorizationUrl?param=1"
      oauth2Authorize(authConfig)

      expect(authConfig.authActions.authPopup.mock.calls.length).toEqual(1)
      expect(authConfig.authActions.authPopup.mock.calls[0][0]).toMatch("https://testauthorizationurl/?param=1&response_type=code&redirect_uri=&scope=scope1%20scope2&state=")

      authConfig.authActions.authPopup.mockReset()
    })

    it("should send code_challenge when using authorizationCode flow with usePkceWithAuthorizationCodeGrant enabled", () => {
      mockSchema.flow = "authorizationCode"

      const expectedCodeVerifier = "mock_code_verifier"
      const expectedCodeChallenge = "mock_code_challenge"

      const generateCodeVerifierSpy = jest.spyOn(utils, "generateCodeVerifier").mockImplementation(() => expectedCodeVerifier)
      const createCodeChallengeSpy = jest.spyOn(utils, "createCodeChallenge").mockImplementation(() => expectedCodeChallenge)

      authConfig.authConfigs.usePkceWithAuthorizationCodeGrant = true

      oauth2Authorize(authConfig)
      expect(authConfig.authActions.authPopup.mock.calls.length).toEqual(1)

      const actualUrl = new URLSearchParams(authConfig.authActions.authPopup.mock.calls[0][0])
      expect(actualUrl.get("code_challenge")).toBe(expectedCodeChallenge)
      expect(actualUrl.get("code_challenge_method")).toBe("S256")

      expect(createCodeChallengeSpy.mock.calls.length).toEqual(1)
      expect(createCodeChallengeSpy.mock.calls[0][0]).toBe(expectedCodeVerifier)

      // The code_verifier should be stored to be able to send in
      // on the TokenUrl call
      expect(authConfig.auth.codeVerifier).toBe(expectedCodeVerifier)

      // Restore spies
      authConfig.authActions.authPopup.mockReset()
      generateCodeVerifierSpy.mockReset()
      createCodeChallengeSpy.mockReset()
    })


    it("should send code_challenge when using accessCode flow with usePkceWithAuthorizationCodeGrant enabled", () => {
      mockSchema.flow = "accessCode"

      const expectedCodeVerifier = "mock_code_verifier"
      const expectedCodeChallenge = "mock_code_challenge"

      const generateCodeVerifierSpy = jest.spyOn(utils, "generateCodeVerifier").mockImplementation(() => expectedCodeVerifier)
      const createCodeChallengeSpy = jest.spyOn(utils, "createCodeChallenge").mockImplementation(() => expectedCodeChallenge)

      authConfig.authConfigs.useBasicAuthenticationWithAccessCodeGrant = true
      authConfig.authConfigs.usePkceWithAuthorizationCodeGrant = true

      oauth2Authorize(authConfig)

      expect(authConfig.authActions.authPopup.mock.calls.length).toEqual(1)

      const actualUrl = new URLSearchParams(authConfig.authActions.authPopup.mock.calls[0][0])
      expect(actualUrl.get("code_challenge")).toBe(expectedCodeChallenge)
      expect(actualUrl.get("code_challenge_method")).toBe("S256")

      expect(createCodeChallengeSpy.mock.calls.length).toEqual(1)
      expect(createCodeChallengeSpy.mock.calls[0][0]).toBe(expectedCodeVerifier)

      // The code_verifier should be stored to be able to send in
      // on the TokenUrl call
      expect(authConfig.auth.codeVerifier).toBe(expectedCodeVerifier)

      // Restore spies
      authConfig.authActions.authPopup.mockReset()
      generateCodeVerifierSpy.mockReset()
      createCodeChallengeSpy.mockReset()
    })

    it("should send code_challenge when using authorization_code flow with usePkceWithAuthorizationCodeGrant enabled", () => {
      mockSchema.flow = "authorization_code"

      const expectedCodeVerifier = "mock_code_verifier"
      const expectedCodeChallenge = "mock_code_challenge"

      const generateCodeVerifierSpy = jest.spyOn(utils, "generateCodeVerifier").mockImplementation(() => expectedCodeVerifier)
      const createCodeChallengeSpy = jest.spyOn(utils, "createCodeChallenge").mockImplementation(() => expectedCodeChallenge)

      authConfig.authConfigs.usePkceWithAuthorizationCodeGrant = true

      oauth2Authorize(authConfig)
      expect(authConfig.authActions.authPopup.mock.calls.length).toEqual(1)

      const actualUrl = new URLSearchParams(authConfig.authActions.authPopup.mock.calls[0][0])
      expect(actualUrl.get("code_challenge")).toBe(expectedCodeChallenge)
      expect(actualUrl.get("code_challenge_method")).toBe("S256")

      expect(createCodeChallengeSpy.mock.calls.length).toEqual(1)
      expect(createCodeChallengeSpy.mock.calls[0][0]).toBe(expectedCodeVerifier)

      // The code_verifier should be stored to be able to send in
      // on the TokenUrl call
      expect(authConfig.auth.codeVerifier).toBe(expectedCodeVerifier)

      // Restore spies
      authConfig.authActions.authPopup.mockReset()
      generateCodeVerifierSpy.mockReset()
      createCodeChallengeSpy.mockReset()
    })

    it("should add list of scopes to authorizeUrl", () => {
      mockSchema.authorizationUrl = "https://testAuthorizationUrl?param=1"

      oauth2Authorize(authConfig2)
      expect(authConfig2.authActions.authPopup.mock.calls.length).toEqual(1)
      expect(authConfig2.authActions.authPopup.mock.calls[0][0]).toMatch("https://testauthorizationurl/?param=1&response_type=code&redirect_uri=&scope=scope2%20scope3&state=")

      authConfig2.authActions.authPopup.mockReset()
    })

    it("should build authorize url for authorization_code flow", () => {
      mockSchema.authorizationUrl = "https://testAuthorizationUrl"
      mockSchema.flow = "authorization_code"

      oauth2Authorize(authConfig3)
      expect(authConfig3.authActions.authPopup.mock.calls.length).toEqual(1)
      expect(authConfig3.authActions.authPopup.mock.calls[0][0]).toMatch("https://testauthorizationurl/?response_type=code&redirect_uri=&scope=scope4%20scope5&state=")

      authConfig3.authActions.authPopup.mockReset()
    })
  })
})
