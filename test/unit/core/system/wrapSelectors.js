import System from "core/system"

describe("wrapSelectors", () => {
  it("should wrap correctly when registering multiple plugins targeting the same selector", function() {
    const probeBase = {
      statePlugins: {
        probe: {
          selectors: {
            selectProbe: () => {
              return "base"
            }
          }
        }
      }
    }
    const probeWrap1 = {
      statePlugins: {
        probe: {
          wrapSelectors: {
            selectProbe: (oriSelector) => (state, ...args) => {
              const selectedValue = oriSelector(state, ...args)
              return `${selectedValue}wrap1`
            }
          }
        }
      }
    }
    const probeWrap2 = {
      statePlugins: {
        probe: {
          wrapSelectors: {
            selectProbe: (oriSelector) => (state, ...args) => {
              const selectedValue = oriSelector(state, ...args)
              return `${selectedValue}wrap2`
            }
          }
        }
      }
    }

    const system = new System({ plugins: [probeBase, probeWrap1, probeWrap2] })

    expect(system.getSystem().probeSelectors.selectProbe()).toEqual("basewrap1wrap2")
  })
})
