import { Map } from "immutable"
import win from "core/window"
import {
  authorizeRequest,
  authorizeAccessCodeWithFormParams,
  authorizeWithPersistOption,
  authorizeOauth2WithPersistOption,
  logoutWithPersistOption,
  persistAuthorizationIfNeeded
} from "corePlugins/auth/actions"
import {authorizeAccessCodeWithBasicAuthentication, authPopup} from "../../../../../src/core/plugins/auth/actions"

describe("auth plugin - actions", () => {

  describe("authorizeRequest", () => {

    [
      [
        {
          oas3: true,
          server: "https://host/resource",
          effectiveServer: "https://host/resource",
          scheme: "http",
          host: null,
          url: "http://specs/file",
        },
        "https://host/authorize"
      ],
      [
        {
          oas3: true,
          server: "https://{selected_host}/resource",
          effectiveServer: "https://host/resource",
          scheme: "http",
          host: null,
          url: "http://specs/file",
        },
        "https://host/authorize"
      ],
      [
        {
          oas3: false,
          server: null,
          effectiveServer: null,
          scheme: "https",
          host: undefined,
          url: "https://specs/file",
        },
        "https://specs/authorize"
      ],
      [
        {
          oas3: false,
          server: null,
          effectiveServer: null,
          scheme: "https",
          host: "host",
          url: "http://specs/file",
        },
        "http://specs/authorize"
      ],
    ].forEach(([{ oas3, server, effectiveServer, scheme, host, url }, expectedFetchUrl]) => {
      it("should resolve authorization endpoint against the server URL", () => {

        // Given
        const data = {
          url: "/authorize"
        }
        const system = {
          fn: {
            fetch: jest.fn().mockImplementation(() => Promise.resolve())
          },
          getConfigs: () => ({}),
          authSelectors: {
            getConfigs: () => ({})
          },
          errActions: {
            newAuthErr: () => ({})
          },
          oas3Selectors: {
            selectedServer: () => server,
            serverEffectiveValue: () => effectiveServer || server
          },
          specSelectors: {
            isOAS3: () => oas3,
            operationScheme: () => scheme,
            host: () => host,
            url: () => url
          }
        }

        // When
        authorizeRequest(data)(system)

        // Then
        expect(system.fn.fetch.mock.calls.length).toEqual(1)
        expect(system.fn.fetch.mock.calls[0][0]).toEqual(expect.objectContaining({ url: expectedFetchUrl }))
      })
    })

    it("should add additionalQueryStringParams to Swagger 2.0 authorization and token URLs", () => {

      // Given
      const data = {
        url: "/authorize?q=1"
      }
      const system = {
        fn: {
          fetch: jest.fn().mockImplementation(() => Promise.resolve())
        },
        getConfigs: () => ({}),
        authSelectors: {
          getConfigs: () => ({
            additionalQueryStringParams: {
              myCustomParam: "abc123"
            }
          })
        },
        errActions: {
          newAuthErr: () => ({})
        },
        specSelectors: {
          isOAS3: () => false,
          operationScheme: () => "https",
          host: () => "http://google.com",
          url: () => "http://google.com/swagger.json"
        }
      }

      // When
      authorizeRequest(data)(system)

      // Then
      expect(system.fn.fetch.mock.calls.length).toEqual(1)

      expect(system.fn.fetch.mock.calls[0][0].url)
        .toEqual("http://google.com/authorize?q=1&myCustomParam=abc123")
    })

    it("should add additionalQueryStringParams to OpenAPI 3.0 authorization and token URLs", () => {

      // Given
      const data = {
        url: "/authorize?q=1"
      }
      const system = {
        fn: {
          fetch: jest.fn().mockImplementation(() => Promise.resolve())
        },
        errActions: {
          newAuthErr: () => ({})
        },
        getConfigs: () => ({}),
        authSelectors: {
          getConfigs: () => ({
            additionalQueryStringParams: {
              myCustomParam: "abc123"
            }
          })
        },
        oas3Selectors: {
          selectedServer: () => "http://google.com",
          serverEffectiveValue: () => "http://google.com"
        },
        specSelectors: {
          isOAS3: () => true,
        }
      }

      // When
      authorizeRequest(data)(system)

      // Then
      expect(system.fn.fetch.mock.calls.length).toEqual(1)

      expect(system.fn.fetch.mock.calls[0][0].url)
        .toEqual("http://google.com/authorize?q=1&myCustomParam=abc123")
    })
  })

  describe("tokenRequest", function () {
    it("should send the code verifier when set", () => {
      const testCodeVerifierForAuthorizationCodeFlows = (flowAction) => {
        const data = {
          auth: {
            schema: {
              get: () => "http://tokenUrl",
            },
            codeVerifier: "mock_code_verifier",
          },
          redirectUrl: "http://google.com",
        }

        const authActions = {
          authorizeRequest: jest.fn(),
        }

        flowAction(data)({ authActions })

        expect(authActions.authorizeRequest.mock.calls.length).toEqual(1)
        const actualArgument = authActions.authorizeRequest.mock.calls[0][0]
        expect(actualArgument.body).toContain("code_verifier=" + data.auth.codeVerifier)
        expect(actualArgument.body).toContain("grant_type=authorization_code")
      }

      testCodeVerifierForAuthorizationCodeFlows(authorizeAccessCodeWithFormParams)
      testCodeVerifierForAuthorizationCodeFlows(authorizeAccessCodeWithBasicAuthentication)
    })
  })

  describe("persistAuthorization", () => {
    describe("wrapped functions with persist option", () => {
      it("should wrap `authorize` action and persist data if needed", () => {

        // Given
        const data = {
          "api_key": {}
        }
        const system = {
          getConfigs: () => ({}),
          authActions: {
            authorize: jest.fn(() => { }),
            persistAuthorizationIfNeeded: jest.fn(() => { })
          }
        }

        // When
        authorizeWithPersistOption(data)(system)

        // Then
        expect(system.authActions.authorize).toHaveBeenCalled()
        expect(system.authActions.authorize).toHaveBeenCalledWith(data)
        expect(system.authActions.persistAuthorizationIfNeeded).toHaveBeenCalled()
      })

      it("should wrap `oauth2Authorize` action and persist data if needed", () => {

        // Given
        const data = {
          "api_key": {}
        }
        const system = {
          getConfigs: () => ({}),
          authActions: {
            authorizeOauth2: jest.fn(() => { }),
            persistAuthorizationIfNeeded: jest.fn(() => { })
          }
        }

        // When
        authorizeOauth2WithPersistOption(data)(system)

        // Then
        expect(system.authActions.authorizeOauth2).toHaveBeenCalled()
        expect(system.authActions.authorizeOauth2).toHaveBeenCalledWith(data)
        expect(system.authActions.persistAuthorizationIfNeeded).toHaveBeenCalled()
      })

      it("should wrap `logout` action and persist data if needed", () => {

        // Given
        const data = {
          "api_key": {}
        }
        const system = {
          getConfigs: () => ({}),
          authActions: {
            logout: jest.fn(() => { }),
            persistAuthorizationIfNeeded: jest.fn(() => { })
          }
        }

        // When
        logoutWithPersistOption(data)(system)

        // Then
        expect(system.authActions.logout).toHaveBeenCalled()
        expect(system.authActions.logout).toHaveBeenCalledWith(data)
        expect(system.authActions.persistAuthorizationIfNeeded).toHaveBeenCalled()
      })
    })

    describe("persistAuthorizationIfNeeded", () => {
      beforeEach(() => {
        localStorage.clear()
      })
      it("should skip if `persistAuthorization` is turned off", () => {
        // Given
        const system = {
          getConfigs: () => ({
            persistAuthorization: false
          }),
          authSelectors: {
            authorized: jest.fn(() => { })
          }
        }

        // When
        persistAuthorizationIfNeeded()(system)

        // Then
        expect(system.authSelectors.authorized).not.toHaveBeenCalled()
      })
      it("should persist authorization data to localStorage", () => {
        // Given
        const data = {
          "api_key": {}
        }
        const system = {
          getConfigs: () => ({
            persistAuthorization: true
          }),
          errActions: {
            newAuthErr: () => ({})
          },
          authSelectors: {
            authorized: jest.fn(() => Map(data))
          }
        }
        jest.spyOn(Object.getPrototypeOf(window.localStorage), "setItem")

        // When
        persistAuthorizationIfNeeded()(system)

        expect(localStorage.setItem).toHaveBeenCalled()
        expect(localStorage.setItem).toHaveBeenCalledWith("authorized", JSON.stringify(data))

      })
    })

    describe("authPopup", () => {
      beforeEach(() => {
        win.open = jest.fn()
      })
      it("should call win.open with url", () => {
        const windowOpenSpy = jest.spyOn(win, "open")

        authPopup("http://swagger.ui", {})()

        expect(windowOpenSpy.mock.calls.length).toEqual(1)
        windowOpenSpy.mockReset()
      })
    })

  })
})
