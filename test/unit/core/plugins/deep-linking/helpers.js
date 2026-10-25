/**
 * @prettier
 */
import { setHash } from "core/plugins/deep-linking/helpers"

describe("deep-linking plugin - helpers", () => {
  describe("setHash", () => {
    let originalLocation
    let pushStateSpy

    beforeEach(() => {
      originalLocation = window.location
      pushStateSpy = jest
        .spyOn(window.history, "pushState")
        .mockImplementation(() => {})
    })

    afterEach(() => {
      pushStateSpy.mockRestore()
      Object.defineProperty(window, "location", {
        configurable: true,
        value: originalLocation,
      })
    })

    const stubLocation = (pathname, search) => {
      Object.defineProperty(window, "location", {
        configurable: true,
        value: { ...originalLocation, pathname, search, hash: "" },
      })
    }

    it("should preserve the current pathname and search when pushing a hash", () => {
      stubLocation("/app/api-docs", "?env=staging")

      setHash("/myTag/myOperation")

      expect(pushStateSpy).toHaveBeenCalledWith(
        null,
        null,
        "/app/api-docs?env=staging#/myTag/myOperation"
      )
    })

    it("should still push a hash when the current URL has no search string", () => {
      stubLocation("/swagger", "")

      setHash("/foo")

      expect(pushStateSpy).toHaveBeenCalledWith(null, null, "/swagger#/foo")
    })

    it("should clear window.location.hash when called with an empty value", () => {
      stubLocation("/swagger", "")
      window.location.hash = "#/foo"

      setHash("")

      expect(window.location.hash).toBe("")
      expect(pushStateSpy).not.toHaveBeenCalled()
    })
  })
})
