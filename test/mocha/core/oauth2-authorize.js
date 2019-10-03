/* eslint-env mocha */
import expect, { createSpy } from "expect"
import { fromJS } from "immutable"
import win from "core/window"
import oauth2Authorize from "core/oauth2-authorize"

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
  })
})
