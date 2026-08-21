/**
 * @prettier
 */

import { parseDeepLinkHash } from "core/plugins/deep-linking/layout"

describe("deep-linking plugin - parseDeepLinkHash", () => {
  const makeSystem = ({ deepLinking = true } = {}) => {
    const show = jest.fn()
    const scrollTo = jest.fn()
    return {
      system: {
        getConfigs: () => ({ deepLinking }),
        layoutActions: { show, scrollTo },
        layoutSelectors: {
          isShownKeyFromUrlHashArray: (hashArray) => {
            const [tag, operationId] = hashArray
            if (operationId) {
              return ["operations", tag, operationId]
            } else if (tag) {
              return ["operations-tag", tag]
            }
            return []
          },
        },
      },
      show,
      scrollTo,
    }
  }

  it("does not parse the hash when deepLinking is disabled", () => {
    const { system, show, scrollTo } = makeSystem({ deepLinking: false })
    parseDeepLinkHash("#/myTag/myOperation")(system)
    expect(show).not.toHaveBeenCalled()
    expect(scrollTo).not.toHaveBeenCalled()
  })

  it("does nothing when the hash is empty", () => {
    const { system, show, scrollTo } = makeSystem()
    parseDeepLinkHash("")(system)
    expect(show).not.toHaveBeenCalled()
    expect(scrollTo).not.toHaveBeenCalled()
  })

  it("expands a tag deep link rooted at '/'", () => {
    const { system, show, scrollTo } = makeSystem()
    parseDeepLinkHash("#/myTag")(system)
    expect(show).toHaveBeenLastCalledWith(["operations-tag", "myTag"], true)
    expect(scrollTo).toHaveBeenCalledWith(["operations-tag", "myTag"])
  })

  it("expands an operation deep link rooted at '/'", () => {
    const { system, show, scrollTo } = makeSystem()
    parseDeepLinkHash("#/myTag/myOperation")(system)
    expect(show).toHaveBeenCalledWith(["operations-tag", "myTag"], true)
    expect(show).toHaveBeenLastCalledWith(
      ["operations", "myTag", "myOperation"],
      true
    )
    expect(scrollTo).toHaveBeenCalledWith([
      "operations",
      "myTag",
      "myOperation",
    ])
  })

  it("expands a deep link with the legacy '!/' shebang prefix", () => {
    const { system, show, scrollTo } = makeSystem()
    parseDeepLinkHash("#!/myTag/myOperation")(system)
    expect(show).toHaveBeenLastCalledWith(
      ["operations", "myTag", "myOperation"],
      true
    )
    expect(scrollTo).toHaveBeenCalledWith([
      "operations",
      "myTag",
      "myOperation",
    ])
  })

  it("ignores a native anchor hash that is not rooted at '/' (regression for #10527)", () => {
    const { system, show, scrollTo } = makeSystem()
    parseDeepLinkHash("#model-Category")(system)
    expect(show).not.toHaveBeenCalled()
    expect(scrollTo).not.toHaveBeenCalled()
  })

  it("ignores a single-token hash that is not rooted at '/' (regression for #10527)", () => {
    const { system, show, scrollTo } = makeSystem()
    parseDeepLinkHash("#some-section")(system)
    expect(show).not.toHaveBeenCalled()
    expect(scrollTo).not.toHaveBeenCalled()
  })
})
