import deepLinking from "core/plugins/deep-linking"

describe("deep-linking plugin", () => {
  afterEach(() => {
    window.location.hash = ""
  })

  it("passes the undecoded location hash to the deep-link parser", () => {
    window.location.hash =
      "#/my-service%2Fcommon/HealthController_check"

    const originalAction = jest.fn()
    const parseDeepLinkHash = jest.fn()
    const [, plugin] = deepLinking()
    const wrapLoaded = plugin.statePlugins.configs.wrapActions.loaded
    const loaded = wrapLoaded(originalAction, {
      layoutActions: { parseDeepLinkHash },
    })

    loaded("config")

    expect(originalAction).toHaveBeenCalledWith("config")
    expect(parseDeepLinkHash).toHaveBeenCalledWith(
      "#/my-service%2Fcommon/HealthController_check"
    )
  })
})
