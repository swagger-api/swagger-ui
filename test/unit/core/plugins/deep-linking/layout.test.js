/**
 * @prettier
 */
import { fromJS } from "immutable"
import {
  parseDeepLinkHash,
  readyToScroll,
} from "core/plugins/deep-linking/layout"

describe("deep-linking layout plugin", () => {
  let consoleWarnSpy
  let consoleErrorSpy

  beforeEach(() => {
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {})
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    consoleWarnSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  describe("parseDeepLinkHash", () => {
    it("should not log console.error or console.warn for operations with generated underscore IDs", () => {
      const showMock = jest.fn()
      const scrollToMock = jest.fn()
      const scrollToVirtualizedOperationMock = jest.fn()

      const system = {
        getConfigs: () => ({ deepLinking: true }),
        layoutActions: {
          show: showMock,
          scrollTo: scrollToMock,
          scrollToVirtualizedOperation: scrollToVirtualizedOperationMock,
        },
        layoutSelectors: {
          isShownKeyFromUrlHashArray: (hashArray) => {
            const [tag, operationId] = hashArray
            if (operationId) {
              return ["operations", tag, operationId]
            }
            if (tag) {
              return ["operations-tag", tag]
            }
            return []
          },
        },
      }

      // e.g. /#/pets/get_pets
      parseDeepLinkHash("#/pets/get_pets")(system)

      expect(consoleErrorSpy).not.toHaveBeenCalled()
      expect(consoleWarnSpy).not.toHaveBeenCalled()
      expect(showMock).toHaveBeenCalledWith(
        ["operations", "pets", "get_pets"],
        true
      )
      expect(showMock).toHaveBeenCalledWith(["operations-tag", "pets"], true)
      expect(scrollToMock).toHaveBeenCalledWith([
        "operations",
        "pets",
        "get_pets",
      ])
    })

    it("should expand legacy whitespace-escaped keys without logging premature console errors", () => {
      const showMock = jest.fn()
      const scrollToMock = jest.fn()
      const scrollToVirtualizedOperationMock = jest.fn()

      const system = {
        getConfigs: () => ({ deepLinking: true }),
        layoutActions: {
          show: showMock,
          scrollTo: scrollToMock,
          scrollToVirtualizedOperation: scrollToVirtualizedOperationMock,
        },
        layoutSelectors: {
          isShownKeyFromUrlHashArray: (hashArray) => {
            const [tag, operationId] = hashArray
            if (operationId) {
              return ["operations", tag, operationId]
            }
            if (tag) {
              return ["operations-tag", tag]
            }
            return []
          },
        },
      }

      parseDeepLinkHash("#/my_Tag/my_Operation")(system)

      // Deprecation should only fire when resolved in readyToScroll, not prematurely in parseDeepLinkHash
      expect(consoleErrorSpy).not.toHaveBeenCalled()
      expect(consoleWarnSpy).not.toHaveBeenCalled()

      // Backwards-compatible expansion with spaces
      expect(showMock).toHaveBeenCalledWith(["operations-tag", "my Tag"], true)
      expect(showMock).toHaveBeenCalledWith(
        ["operations", "my Tag", "my Operation"],
        true
      )
    })
  })

  describe("readyToScroll", () => {
    it("should scroll without warning when scrollToKey exactly matches an operation with underscores", () => {
      const scrollToElementMock = jest.fn()
      const clearScrollToMock = jest.fn()
      const ref = document.createElement("div")

      const system = {
        layoutSelectors: {
          getScrollToKey: () => fromJS(["operations", "pets", "get_pets"]),
        },
        layoutActions: {
          scrollToElement: scrollToElementMock,
          clearScrollTo: clearScrollToMock,
        },
      }

      readyToScroll(["operations", "pets", "get_pets"], ref)(system)

      expect(scrollToElementMock).toHaveBeenCalledWith(ref)
      expect(clearScrollToMock).toHaveBeenCalled()
      expect(consoleErrorSpy).not.toHaveBeenCalled()
      expect(consoleWarnSpy).not.toHaveBeenCalled()
    })

    it("should log deprecation console.warn and scroll when legacy underscore escaping resolves to whitespace", () => {
      const scrollToElementMock = jest.fn()
      const clearScrollToMock = jest.fn()
      const ref = document.createElement("div")

      const system = {
        layoutSelectors: {
          getScrollToKey: () =>
            fromJS(["operations", "my_Tag", "my_Operation"]),
        },
        layoutActions: {
          scrollToElement: scrollToElementMock,
          clearScrollTo: clearScrollToMock,
        },
      }

      readyToScroll(["operations", "my Tag", "my Operation"], ref)(system)

      expect(scrollToElementMock).toHaveBeenCalledWith(ref)
      expect(clearScrollToMock).toHaveBeenCalled()
      expect(consoleErrorSpy).not.toHaveBeenCalled()
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Deprecated: escaping deep link whitespace with `_` is unsupported and will be removed in a future 5.x release. Use `%20` instead."
      )
    })

    it("should log deprecation console.warn and scroll when legacy underscore escaping is used on a tag", () => {
      const scrollToElementMock = jest.fn()
      const clearScrollToMock = jest.fn()
      const ref = document.createElement("div")

      const system = {
        layoutSelectors: {
          getScrollToKey: () => fromJS(["operations-tag", "my_Tag"]),
        },
        layoutActions: {
          scrollToElement: scrollToElementMock,
          clearScrollTo: clearScrollToMock,
        },
      }

      readyToScroll(["operations-tag", "my Tag"], ref)(system)

      expect(scrollToElementMock).toHaveBeenCalledWith(ref)
      expect(clearScrollToMock).toHaveBeenCalled()
      expect(consoleErrorSpy).not.toHaveBeenCalled()
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Deprecated: escaping deep link whitespace with `_` is unsupported and will be removed in a future 5.x release. Use `%20` instead."
      )
    })

    it("should not scroll or warn when keys do not match", () => {
      const scrollToElementMock = jest.fn()
      const clearScrollToMock = jest.fn()
      const ref = document.createElement("div")

      const system = {
        layoutSelectors: {
          getScrollToKey: () => fromJS(["operations", "other", "other_op"]),
        },
        layoutActions: {
          scrollToElement: scrollToElementMock,
          clearScrollTo: clearScrollToMock,
        },
      }

      readyToScroll(["operations", "pets", "get_pets"], ref)(system)

      expect(scrollToElementMock).not.toHaveBeenCalled()
      expect(clearScrollToMock).not.toHaveBeenCalled()
      expect(consoleErrorSpy).not.toHaveBeenCalled()
      expect(consoleWarnSpy).not.toHaveBeenCalled()
    })

    it("should not let a legacy whitespace match consume an exact-underscore link when whitespace target renders first", () => {
      const scrollToElementMock = jest.fn()
      const clearScrollToMock = jest.fn()
      const whitespaceRef = document.createElement("div")
      const exactRef = document.createElement("div")

      const system = {
        layoutSelectors: {
          getScrollToKey: jest
            .fn()
            .mockReturnValue(fromJS(["operations", "pets", "get_pets"])),
        },
        layoutActions: {
          scrollToElement: scrollToElementMock,
          clearScrollTo: clearScrollToMock,
        },
        specSelectors: {
          operationsWithTags: () =>
            fromJS({
              pets: [
                { id: "get pets", operation: { operationId: "get pets" } },
                { id: "get_pets", operation: { operationId: "get_pets" } },
              ],
            }),
        },
      }

      // 1. Whitespace target renders first
      readyToScroll(["operations", "pets", "get pets"], whitespaceRef)(system)

      expect(scrollToElementMock).not.toHaveBeenCalled()
      expect(clearScrollToMock).not.toHaveBeenCalled()
      expect(consoleWarnSpy).not.toHaveBeenCalled()

      // 2. Exact target renders second
      readyToScroll(["operations", "pets", "get_pets"], exactRef)(system)

      expect(scrollToElementMock).toHaveBeenCalledWith(exactRef)
      expect(clearScrollToMock).toHaveBeenCalled()
      expect(consoleWarnSpy).not.toHaveBeenCalled()
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    it("should not let a legacy whitespace tag match consume an exact-underscore tag link when whitespace tag renders first", () => {
      const scrollToElementMock = jest.fn()
      const clearScrollToMock = jest.fn()
      const whitespaceTagRef = document.createElement("div")
      const exactTagRef = document.createElement("div")

      const system = {
        layoutSelectors: {
          getScrollToKey: jest
            .fn()
            .mockReturnValue(fromJS(["operations-tag", "pet_store"])),
        },
        layoutActions: {
          scrollToElement: scrollToElementMock,
          clearScrollTo: clearScrollToMock,
        },
        specSelectors: {
          tags: () => fromJS([{ name: "pet store" }, { name: "pet_store" }]),
        },
      }

      // 1. Whitespace tag renders first
      readyToScroll(["operations-tag", "pet store"], whitespaceTagRef)(system)

      expect(scrollToElementMock).not.toHaveBeenCalled()
      expect(clearScrollToMock).not.toHaveBeenCalled()
      expect(consoleWarnSpy).not.toHaveBeenCalled()

      // 2. Exact tag renders second
      readyToScroll(["operations-tag", "pet_store"], exactTagRef)(system)

      expect(scrollToElementMock).toHaveBeenCalledWith(exactTagRef)
      expect(clearScrollToMock).toHaveBeenCalled()
      expect(consoleWarnSpy).not.toHaveBeenCalled()
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })
  })
})
