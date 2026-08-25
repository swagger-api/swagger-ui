/**
 * @prettier
 */
import React from "react"
import { mount } from "enzyme"
import Models from "core/plugins/oas31/components/models/models"

jest.mock("@tanstack/react-virtual", () => ({
  useVirtualizer: () => ({
    getVirtualItems: () => [],
    getTotalSize: () => 0,
    measureElement: () => {},
  }),
}))

describe("<Models/> (oas31)", function () {
  const dummyComponent = () => null
  /* eslint-disable react/prop-types */
  const DummyComponentWithChildren = ({ children }) => <div>{children}</div>

  const makeProps = (overrides = {}) => ({
    getComponent: (c) => {
      const components = {
        Collapse: DummyComponentWithChildren,
        JSONSchema202012: React.forwardRef(({ name }) => (
          <div className="schema-item" data-name={name} />
        )),
        ArrowUpIcon: dummyComponent,
        ArrowDownIcon: dummyComponent,
      }
      return components[c] || dummyComponent
    },
    specSelectors: {
      selectSchemas: () => ({ Schema1: {}, Schema2: {} }),
      specResolvedSubtree: () => undefined,
    },
    layoutSelectors: {
      isShown: jest.fn(() => false),
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
    fn: {
      jsonSchema202012: {
        useFn: () => ({ getTitle: () => null }),
      },
    },
    ...overrides,
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

  it("returns null when there are no schemas", function () {
    const props = makeProps({
      specSelectors: {
        selectSchemas: () => ({}),
        specResolvedSubtree: () => undefined,
      },
    })

    const wrapper = mount(<Models {...props} />)

    expect(wrapper.html()).toBeNull()
  })

  it("uses non-virtualized path when schema count is below threshold", function () {
    const props = makeProps()

    const wrapper = mount(<Models {...props} />)

    expect(wrapper.find(".models-scroll").length).toEqual(0)
    expect(wrapper.find(".schema-item").length).toEqual(2)
  })

  it("uses non-virtualized path when schema count is just below threshold (99)", function () {
    const schemas = {}
    for (let i = 0; i < 99; i++) {
      schemas[`Schema${i}`] = {}
    }
    const props = makeProps({
      specSelectors: {
        selectSchemas: () => schemas,
        specResolvedSubtree: () => undefined,
      },
    })

    const wrapper = mount(<Models {...props} />)

    expect(wrapper.find(".models-scroll").length).toEqual(0)
    expect(wrapper.find(".schema-item").length).toEqual(99)
  })

  it("uses virtualized path when schema count is at threshold (100)", function () {
    const schemas = {}
    for (let i = 0; i < 100; i++) {
      schemas[`Schema${i}`] = {}
    }
    const props = makeProps({
      specSelectors: {
        selectSchemas: () => schemas,
        specResolvedSubtree: () => undefined,
      },
    })

    const wrapper = mount(<Models {...props} />)

    expect(wrapper.find(".models-scroll").length).toEqual(1)
    // virtualizer mock returns no items, so no schema-item should be rendered
    expect(wrapper.find(".schema-item").length).toEqual(0)
  })
})
