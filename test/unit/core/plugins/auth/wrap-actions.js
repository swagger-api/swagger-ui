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
        "apiKeyCookie=test;samesite=None;path=/"
      )
    })

    it("should persist secure cookie in document.cookie for non-SSL targets", () => {
      const system = {
        getConfigs: () => ({
          persistAuthorization: true,
          url: "http://example.org"
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
        "apiKeyCookie=test;samesite=None;path=/"
      )
    })

    it("should persist secure cookie in document.cookie for SSL targets", () => {
      const system = {
        getConfigs: () => ({
          persistAuthorization: true,
          url: "https://example.org"
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
        "apiKeyCookie=test;samesite=None;secure;path=/"
      )
    })

    it("should persist secure cookie in document.cookie for non-root SSL targets", () => {
      const system = {
        getConfigs: () => ({
          persistAuthorization: true,
          url: "https://example.org/api"
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
        "apiKeyCookie=test;samesite=None;secure;path=/api"
      )
    })

    it("should persist secure cookie in document.cookie for SSL targets with non-root multi-level base path", () => {
      const system = {
        getConfigs: () => ({
          persistAuthorization: true,
          url: "https://example.org/api/production"
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
        "apiKeyCookie=test;samesite=None;secure;path=/api/production"
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

      expect(document.cookie).toEqual("apiKeyCookie=;max-age=-99999999;path=/")
    })

    it("should delete cookie from document.cookie for targets with non-root multi-level base path", () => {
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
          url: "https://example.org/api/production"
        }),
        authSelectors: {
          authorized: () => payload,
        },
      }

      logout(jest.fn(), system)(["api_key"])

      expect(document.cookie).toEqual("apiKeyCookie=;max-age=-99999999;path=/api/production")
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

  it("should delete cookie from document.cookie for targets with non-root multi-level base path", () => {
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
        url: "https://example.org/api/production"
      }),
      authSelectors: {
        authorized: () => payload,
      },
    }

    logout(jest.fn(), system)(["api_key"])

    expect(document.cookie).toEqual("")
  })
})
