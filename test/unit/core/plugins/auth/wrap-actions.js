/**
 * @prettier
 */
import { fromJS } from "immutable"
import { authorize, logout } from "core/plugins/auth/wrap-actions"

describe("Cookie based apiKey persistence in document.cookie", () => {
  beforeEach(() => {
    let cookieJar = ""
    jest.spyOn(document, "cookie", "set").mockImplementation((cookie) => {
      cookieJar += cookie
    })
    jest.spyOn(document, "cookie", "get").mockImplementation(() => cookieJar)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe("given persistAuthorization=true", () => {
    it("should persist cookie in document.cookie", () => {
      const system = {
        getConfigs: () => ({
          persistAuthorization: true,
        }),
      }
      const payload = {
        api_key: {
          schema: fromJS({
            type: "apiKey",
            name: "apiKeyCookie",
            in: "cookie",
          }),
          value: "test",
        },
      }

      authorize(jest.fn(), system)(payload)

      expect(document.cookie).toEqual(
        "apiKeyCookie=test; SameSite=None; Secure"
      )
    })

    it("should persist cookie in document.cookie if schema is a plain object", () => {
      const system = {
        getConfigs: () => ({
          persistAuthorization: true,
        }),
      }
      const payload = {
        api_key: {
          schema: {
            type: "apiKey",
            name: "apiKeyCookie",
            in: "cookie",
          },
          value: "test",
        },
      }

      authorize(jest.fn(), system)(payload)

      expect(document.cookie).toEqual(
        "apiKeyCookie=test; SameSite=None; Secure"
      )
    })

    it("should delete cookie from document.cookie", () => {
      const payload = fromJS({
        api_key: {
          schema: {
            type: "apiKey",
            name: "apiKeyCookie",
            in: "cookie",
          },
          value: "test",
        },
      })
      const system = {
        getConfigs: () => ({
          persistAuthorization: true,
        }),
        authSelectors: {
          authorized: () => payload,
        },
      }

      logout(jest.fn(), system)(["api_key"])

      expect(document.cookie).toEqual("apiKeyCookie=; Max-Age=-99999999")
    })

    it("should delete cookie even when payload contains names missing from the authorized store", () => {
      // Defensive: if `authorized.get(name)` can't find an entry, the
      // fallback must expose `.getIn(...)` safely. A plain-object
      // fallback crashes here; an empty Immutable Map() keeps the
      // iteration going and still clears cookies for names that are
      // present. Guards the fix for
      // https://github.com/swagger-api/swagger-ui/issues/10761.
      const authorized = fromJS({
        api_key: {
          schema: {
            type: "apiKey",
            name: "apiKeyCookie",
            in: "cookie",
          },
          value: "test",
        },
      })
      const system = {
        getConfigs: () => ({
          persistAuthorization: true,
        }),
        authSelectors: {
          authorized: () => authorized,
        },
      }
      const oriAction = jest.fn()

      const logoutAction = () =>
        logout(oriAction, system)(["missing_auth", "api_key"])

      expect(logoutAction).not.toThrow()
      expect(document.cookie).toEqual("apiKeyCookie=; Max-Age=-99999999")
      expect(oriAction).toHaveBeenCalledWith(["missing_auth", "api_key"])
    })

    it("should not throw when every name in payload is missing from the authorized store", () => {
      const system = {
        getConfigs: () => ({
          persistAuthorization: true,
        }),
        authSelectors: {
          authorized: () => fromJS({}),
        },
      }

      const logoutAction = () => logout(jest.fn(), system)(["missing_auth"])

      expect(logoutAction).not.toThrow()
      expect(document.cookie).toEqual("")
    })
  })

  describe("given persistAuthorization=false", () => {
    it("shouldn't persist cookie in document.cookie", () => {
      const system = {
        getConfigs: () => ({
          persistAuthorization: false,
        }),
      }
      const payload = {
        api_key: {
          schema: fromJS({
            type: "apiKey",
            name: "apiKeyCookie",
            in: "cookie",
          }),
          value: "test",
        },
      }

      authorize(jest.fn(), system)(payload)

      expect(document.cookie).toEqual("")
    })

    it("should delete cookie from document.cookie", () => {
      const payload = fromJS({
        api_key: {
          schema: {
            type: "apiKey",
            name: "apiKeyCookie",
            in: "cookie",
          },
          value: "test",
        },
      })
      const system = {
        getConfigs: () => ({
          persistAuthorization: false,
        }),
        authSelectors: {
          authorized: () => payload,
        },
      }

      logout(jest.fn(), system)(["api_key"])

      expect(document.cookie).toEqual("")
    })
  })
})
