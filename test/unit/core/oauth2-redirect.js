/**
 * @prettier
 */
import fs from "fs"
import path from "path"

const REDIRECT_SCRIPT_PATH = path.resolve(
  __dirname,
  "../../../dev-helpers/oauth2-redirect.js"
)
const REDIRECT_SCRIPT = fs.readFileSync(REDIRECT_SCRIPT_PATH, "utf8")

const setLocation = (search, hash) => {
  Object.defineProperty(window, "location", {
    configurable: true,
    value: {
      hash: hash || "",
      search: search || "",
    },
  })
}

const setOpener = (opener) => {
  Object.defineProperty(window, "opener", {
    configurable: true,
    value: opener,
  })
}

const runRedirectScript = () => {
  // Evaluate the script in the current jsdom window context
  // eslint-disable-next-line no-new-func
  new Function(REDIRECT_SCRIPT)()
}

describe("oauth2-redirect", () => {
  let originalLocation
  let originalOpener
  let closeSpy

  beforeEach(() => {
    originalLocation = window.location
    originalOpener = window.opener
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild)
    }
    closeSpy = jest.spyOn(window, "close").mockImplementation(() => {})
    setLocation("", "")
  })

  afterEach(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    })
    setOpener(originalOpener)
    closeSpy.mockRestore()
  })

  describe("when window.opener is null", () => {
    it("renders an explanatory message and does not throw", () => {
      setOpener(null)

      expect(() => runRedirectScript()).not.toThrow()
      expect(document.body.innerText).toMatch(/OAuth redirect cannot complete/)
      expect(closeSpy).not.toHaveBeenCalled()
    })
  })

  describe("when window.opener has no swaggerUIRedirectOauth2", () => {
    it("renders an explanatory message and does not throw", () => {
      setOpener({})

      expect(() => runRedirectScript()).not.toThrow()
      expect(document.body.innerText).toMatch(/OAuth redirect cannot complete/)
      expect(closeSpy).not.toHaveBeenCalled()
    })
  })

  describe("when window.opener.swaggerUIRedirectOauth2 is present", () => {
    it("relays the auth code via callback for authorization_code flow", () => {
      const callback = jest.fn()
      const errCb = jest.fn()
      const oauth2 = {
        state: "abc",
        redirectUrl: "https://example.org/callback",
        auth: {
          name: "OAuth2",
          schema: {
            get: (key) => (key === "flow" ? "authorization_code" : null),
          },
        },
        callback,
        errCb,
      }
      setOpener({ swaggerUIRedirectOauth2: oauth2 })
      setLocation("?code=auth-code-123&state=abc", "")

      runRedirectScript()

      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback.mock.calls[0][0]).toEqual({
        auth: expect.objectContaining({ code: "auth-code-123" }),
        redirectUrl: "https://example.org/callback",
      })
      expect(errCb).not.toHaveBeenCalled()
      expect(closeSpy).toHaveBeenCalledTimes(1)
    })
  })
})
