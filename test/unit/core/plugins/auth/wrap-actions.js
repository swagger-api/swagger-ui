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
