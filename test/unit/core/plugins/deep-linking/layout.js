import deepLinkingLayout, {
  parseDeepLinkHash,
} from "core/plugins/deep-linking/layout"

describe("deep-linking layout plugin", () => {
  describe("parseDeepLinkHash", () => {
    const selector =
      deepLinkingLayout.statePlugins.layout.selectors
        .isShownKeyFromUrlHashArray

    const createSystem = () => {
      const layoutActions = {
        show: jest.fn(),
        scrollTo: jest.fn(),
      }
      const layoutSelectors = {
        isShownKeyFromUrlHashArray: jest.fn((hashArray) =>
          selector(undefined, hashArray)
        ),
      }

      return {
        system: {
          getConfigs: () => ({ deepLinking: true }),
          layoutActions,
          layoutSelectors,
        },
        layoutActions,
        layoutSelectors,
      }
    }

    it("decodes an encoded slash after splitting tag and operation segments", () => {
      const { system, layoutActions, layoutSelectors } = createSystem()

      parseDeepLinkHash(
        "#/my-service%2Fcommon/HealthController_check"
      )(system)

      expect(
        layoutSelectors.isShownKeyFromUrlHashArray
      ).toHaveBeenNthCalledWith(1, [
        "my-service/common",
        "HealthController_check",
      ])
      expect(layoutActions.show).toHaveBeenNthCalledWith(
        1,
        ["operations-tag", "my-service/common"],
        true
      )
      expect(layoutActions.show).toHaveBeenCalledWith(
        [
          "operations",
          "my-service/common",
          "HealthController_check",
        ],
        true
      )
      expect(layoutActions.scrollTo).toHaveBeenCalledWith([
        "operations",
        "my-service/common",
        "HealthController_check",
      ])
    })

    it("decodes an encoded slash in a tag-only deep link", () => {
      const { system, layoutActions, layoutSelectors } = createSystem()

      parseDeepLinkHash("#/my-service%2Fcommon")(system)

      expect(
        layoutSelectors.isShownKeyFromUrlHashArray
      ).toHaveBeenCalledWith(["my-service/common"])
      expect(layoutActions.show).toHaveBeenCalledWith(
        ["operations-tag", "my-service/common"],
        true
      )
      expect(layoutActions.scrollTo).toHaveBeenCalledWith([
        "operations-tag",
        "my-service/common",
      ])
    })
  })
})
