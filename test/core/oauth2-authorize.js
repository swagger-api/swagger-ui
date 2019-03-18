/* eslint-env mocha */
import expect, { createSpy } from "expect"
import { fromJS } from "immutable"
import win from "core/window"
import oauth2Authorize from "core/oauth2-authorize"

describe("oauth2", function () {

  let mockSchema = {
    flow: "accessCode",
    authorizationUrl: "https://testauthorizationurl"
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
      expect(win.open.calls[0].arguments[0]).toMatch("https://testauthorizationurl?response_type=code&redirect_uri=&state=")
    })

    it("should build authorize url relative", function() {
      let relativeMockSchema = {
        flow: "accessCode",
        authorizationUrl: "/testauthorizationurl"
      }
      let relativeAuthConfig = {
        auth: { schema: { get: (key)=> relativeMockSchema[key] } },
        authActions: {},
        errActions: {},
        configs: { oauth2RedirectUrl: "" },
        authConfigs: {},
        currentServer: "https://currentserver"
      }
      win.open = createSpy()
      oauth2Authorize(relativeAuthConfig)
      expect(win.open.calls.length).toEqual(1)
      expect(win.open.calls[0].arguments[0]).toMatch("https://currentserver/testauthorizationurl?response_type=code&redirect_uri=&state=")
    })

    it("should append query parameters to authorizeUrl with query parameters", function() {
      win.open = createSpy()
      mockSchema.authorizationUrl = "https://testauthorizationurl?param=1"
      oauth2Authorize(authConfig)
      expect(win.open.calls.length).toEqual(1)
      expect(win.open.calls[0].arguments[0]).toMatch("https://testauthorizationurl?param=1&response_type=code&redirect_uri=&state=")
    })
  })
})
