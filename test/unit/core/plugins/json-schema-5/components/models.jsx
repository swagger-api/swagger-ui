/**
 * @prettier
 */
import React from "react"
import { mount } from "enzyme"
import { fromJS, Map } from "immutable"
import Models from "core/plugins/json-schema-5/components/models"

jest.mock("@tanstack/react-virtual", () => ({
  useVirtualizer: () => ({
    getVirtualItems: () => [],
    getTotalSize: () => 0,
    measureElement: () => {},
  }),
}))

describe("<Models/>", function () {
  const dummyComponent = () => null
  /* eslint-disable react/prop-types */
  const DummyComponentWithChildren = ({ children }) => <div>{children}</div>

  const makeComponents = (overrides = {}) => ({
    Collapse: DummyComponentWithChildren,
    ModelWrapper: dummyComponent,
    JumpToPath: dummyComponent,
    ModelCollapse: DummyComponentWithChildren,
    ArrowUpIcon: dummyComponent,
    ArrowDownIcon: dummyComponent,
    ...overrides,
  })

  const makeProps = (overrides = {}) => ({
    getComponent: (c) => makeComponents()[c] || dummyComponent,
    specSelectors: {
      isOAS3: () => false,
      specJson: () => Map(),
      definitions: () => fromJS({ def1: {}, def2: {} }),
      specResolvedSubtree: () => {},
    },
    layoutSelectors: {
      isShown: jest.fn(),
      getScrollToVirtualizedSchema: jest.fn(() => null),
    },
    layoutActions: {
      show: jest.fn(),
      readyToScroll: jest.fn(),
    },
    specActions: {
      requestResolvedSubtree: jest.fn(),
    },
    getConfigs: () => ({
      docExpansion: "list",
      defaultModelsExpandDepth: 1,
    }),
    ...overrides,
  })

  it("passes defaultModelsExpandDepth to ModelWrapper", function () {
    const ModelWrapperSpy = jest.fn(() => null)
    const props = makeProps({
      getComponent: (c) => {
        if (c === "ModelWrapper") return ModelWrapperSpy
        return makeComponents()[c] || dummyComponent
      },
      getConfigs: () => ({ docExpansion: "list", defaultModelsExpandDepth: 2 }),
    })

    mount(<Models {...props} />)

    expect(ModelWrapperSpy).toHaveBeenCalled()

    const receivedProps = ModelWrapperSpy.mock.calls[0][0]

    expect(receivedProps.expandDepth).toBe(2)
  })

  it("returns null when defaultModelsExpandDepth < 0", function () {
    const props = makeProps({
      getConfigs: () => ({
        docExpansion: "list",
        defaultModelsExpandDepth: -1,
      }),
    })

    const wrapper = mount(<Models {...props} />)

    expect(wrapper.html()).toBeNull()
  })

  it("returns null when there are no definitions", function () {
    const props = makeProps({
      specSelectors: {
        isOAS3: () => false,
        specJson: () => Map(),
        definitions: () => fromJS({}),
        specResolvedSubtree: () => undefined,
      },
    })

    const wrapper = mount(<Models {...props} />)

    expect(wrapper.html()).toBeNull()
  })

  it("uses docExpansion config to determine default open state", function () {
    const isShownMock = jest.fn(() => false)
    const props = makeProps({
      layoutSelectors: {
        isShown: isShownMock,
        getScrollToVirtualizedSchema: jest.fn(() => null),
      },
      getConfigs: () => ({ docExpansion: "none", defaultModelsExpandDepth: 1 }),
    })

    mount(<Models {...props} />)

    expect(isShownMock).toHaveBeenCalledWith(["definitions"], false)
  })

  it("uses non-virtualized path when definition count is below threshold", function () {
    const props = makeProps()

    const wrapper = mount(<Models {...props} />)

    expect(wrapper.find(".models-scroll").length).toEqual(0)
    expect(wrapper.find(".model-container").length).toEqual(2)
  })

  it("uses non-virtualized path when definition count is just below threshold (99)", function () {
    const defs = {}

    for (let i = 0; i < 99; i++) {
      defs[`Schema${i}`] = {}
    }

    const props = makeProps({
      specSelectors: {
        isOAS3: () => false,
        specJson: () => Map(),
        definitions: () => fromJS(defs),
        specResolvedSubtree: () => undefined,
      },
    })

    const wrapper = mount(<Models {...props} />)

    expect(wrapper.find(".models-scroll").length).toEqual(0)
    expect(wrapper.find(".model-container").length).toEqual(99)
  })

  it("uses virtualized path when definition count is at threshold (100)", function () {
    const defs = {}

    for (let i = 0; i < 100; i++) {
      defs[`Schema${i}`] = {}
    }

    const props = makeProps({
      specSelectors: {
        isOAS3: () => false,
        specJson: () => Map(),
        definitions: () => fromJS(defs),
        specResolvedSubtree: () => undefined,
      },
    })

    const wrapper = mount(<Models {...props} />)

    expect(wrapper.find(".models-scroll").length).toEqual(1)
    // virtualizer mock returns no items, so no .model-container should be in DOM
    expect(wrapper.find(".model-container").length).toEqual(0)
  })
})
