/**
 * @prettier
 */
import React from "react"
import { render, mount } from "enzyme"
import { fromJS, OrderedMap, List } from "immutable"
import DeepLink from "core/components/deep-link"
import Operations from "core/components/operations"
import { Collapse } from "core/components/layout-utils"

jest.mock("@tanstack/react-virtual", () => {
  const instance = () => ({
    getVirtualItems: () => [],
    getTotalSize: () => 0,
    measureElement: () => {},
    scrollToIndex: jest.fn(),
    options: { scrollMargin: 0 },
  })
  return {
    useWindowVirtualizer: jest.fn(instance),
    useVirtualizer: jest.fn(instance),
  }
})

jest.mock("swagger-client/es/helpers", () => ({
  opId: (op, path, method) => `${path}-${method}`,
}))

const components = {
  Collapse,
  DeepLink,
  // eslint-disable-next-line react/prop-types
  OperationContainer: ({ path, method }) => (
    <span className="mocked-op" id={`${path}-${method}`} />
  ),
  OperationTag: "div",
}

const dummyComponent = () => null
/* eslint-disable react/prop-types */
const DummyComponentWithChildren = ({ children }) => <div>{children}</div>

const makeOp = (path, method, tag, operationId) =>
  fromJS({
    path,
    method,
    specPath: ["paths", path, method],
    operation: operationId ? { operationId } : {},
    id: `${path}-${method}`,
  })

const makeTaggedOps = (entries) =>
  entries.reduce(
    (map, [tag, ops]) =>
      map.set(
        tag,
        fromJS({
          tagDetails: {},
          operations: List(
            ops.map(([path, method, id]) => makeOp(path, method, tag, id))
          ),
        })
      ),
    OrderedMap()
  )

const makeProps = (overrides = {}) => ({
  specSelectors: {
    taggedOperations: () =>
      makeTaggedOps([["pets", [["/pets", "get", "listPets"]]]]),
    validOperationMethods: () => [
      "get",
      "post",
      "put",
      "delete",
      "patch",
      "head",
      "options",
    ],
    url: () => "http://example.com/spec.yaml",
  },
  specActions: {},
  oas3Actions: {},
  oas3Selectors: { selectedServer: () => "" },
  layoutSelectors: {
    isShown: jest.fn(() => true),
    getScrollToVirtualizedOperation: jest.fn(() => null),
  },
  layoutActions: {
    show: jest.fn(),
    clearScrollToVirtualizedOperation: jest.fn(),
    clearScrollTo: jest.fn(),
  },
  authActions: {},
  authSelectors: {},
  getComponent: (c) => {
    const map = {
      OperationContainer: dummyComponent,
      OperationTag: DummyComponentWithChildren,
      Collapse: DummyComponentWithChildren,
      Markdown: dummyComponent,
      DeepLink: dummyComponent,
      Link: dummyComponent,
      ArrowUpIcon: dummyComponent,
      ArrowDownIcon: dummyComponent,
    }
    return map[c] || dummyComponent
  },
  getConfigs: () => ({ docExpansion: "list" }),
  fn: {},
  ...overrides,
})

describe("<Operations/>", function () {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should render a Swagger2 `get` method, but not a `trace` or `foo` method", function () {
    const props = makeProps({
      getComponent: (name) => components[name] || null,
      getConfigs: () => ({}),
      specSelectors: {
        url: () => "https://petstore.swagger.io/v2/swagger.json",
        validOperationMethods: () => [
          "get",
          "put",
          "post",
          "delete",
          "options",
          "head",
          "patch",
        ],
        taggedOperations: () =>
          fromJS({
            default: {
              operations: [
                { path: "/pets/{id}", method: "get" },
                { path: "/pets/{id}", method: "trace" },
                { path: "/pets/{id}", method: "foo" },
              ],
            },
          }),
      },
    })

    const wrapper = render(<Operations {...props} />)

    expect(wrapper.find("span.mocked-op").length).toEqual(1)
    expect(wrapper.find("span.mocked-op").eq(0).attr("id")).toEqual(
      "/pets/{id}-get"
    )
  })

  it("should render an OAS3 `get` and `trace` method, but not a `foo` method", function () {
    const props = makeProps({
      getComponent: (name) => components[name] || null,
      getConfigs: () => ({}),
      specSelectors: {
        url: () => "https://petstore.swagger.io/v2/swagger.json",
        validOperationMethods: () => [
          "get",
          "put",
          "post",
          "delete",
          "options",
          "head",
          "patch",
          "trace",
        ],
        taggedOperations: () =>
          fromJS({
            default: {
              operations: [
                { path: "/pets/{id}", method: "get" },
                { path: "/pets/{id}", method: "trace" },
                { path: "/pets/{id}", method: "foo" },
              ],
            },
          }),
      },
    })

    const wrapper = render(<Operations {...props} />)

    expect(wrapper.find("span.mocked-op").length).toEqual(2)
    expect(wrapper.find("span.mocked-op").eq(0).attr("id")).toEqual(
      "/pets/{id}-get"
    )
    expect(wrapper.find("span.mocked-op").eq(1).attr("id")).toEqual(
      "/pets/{id}-trace"
    )
  })

  it("renders 'No operations defined in spec!' when taggedOps is empty", function () {
    const props = makeProps({
      specSelectors: {
        taggedOperations: () => OrderedMap(),
        validOperationMethods: () => ["get"],
        url: () => "",
      },
    })

    const wrapper = mount(<Operations {...props} />)

    expect(wrapper.text()).toContain("No operations defined in spec!")
  })

  it("uses non-virtualized path when item count is below threshold", function () {
    const wrapper = mount(<Operations {...makeProps()} />)

    expect(
      wrapper.find("[style]").filterWhere((n) => {
        const s = n.prop("style") || {}
        return s.position === "absolute"
      }).length
    ).toEqual(0)
  })

  it("uses non-virtualized path when item count is just below threshold (149)", function () {
    const ops = Array.from({ length: 148 }, (_, i) => [
      `/p${i}`,
      "get",
      `op${i}`,
    ])
    const props = makeProps({
      specSelectors: {
        taggedOperations: () => makeTaggedOps([["tag0", ops]]),
        validOperationMethods: () => ["get"],
        url: () => "",
      },
    })

    const wrapper = mount(<Operations {...props} />)

    expect(
      wrapper.find("[style]").filterWhere((n) => {
        const s = n.prop("style") || {}
        return s.position === "absolute"
      }).length
    ).toEqual(0)
  })

  it("uses virtualized path when item count is at threshold (150)", function () {
    const ops = Array.from({ length: 149 }, (_, i) => [
      `/p${i}`,
      "get",
      `op${i}`,
    ])
    const props = makeProps({
      specSelectors: {
        taggedOperations: () => makeTaggedOps([["tag0", ops]]),
        validOperationMethods: () => ["get"],
        url: () => "",
      },
    })

    const wrapper = mount(<Operations {...props} />)

    expect(wrapper.find(".operations-virtual__list").length).toBeGreaterThan(0)
  })

  it("renders OperationTag for each tag in the non-virtualized path", function () {
    const TagSpy = jest.fn(({ children }) => <div>{children}</div>)
    const props = makeProps({
      getComponent: (c) => {
        if (c === "OperationTag") return TagSpy
        if (c === "OperationContainer") return dummyComponent
        return ({ children }) => <div>{children}</div>
      },
      specSelectors: {
        taggedOperations: () =>
          makeTaggedOps([
            ["tagA", [["/a", "get", "opA"]]],
            ["tagB", [["/b", "post", "opB"]]],
          ]),
        validOperationMethods: () => ["get", "post"],
        url: () => "",
      },
    })

    mount(<Operations {...props} />)

    expect(TagSpy).toHaveBeenCalledTimes(2)
  })

  it("renders OperationTag for each tag in the virtualized path", function () {
    const TagSpy = jest.fn(() => null)
    const { useWindowVirtualizer } = jest.requireMock("@tanstack/react-virtual")
    useWindowVirtualizer.mockReturnValueOnce({
      getVirtualItems: () => [
        { index: 0, key: "tag-tagA", start: 0 },
        { index: 76, key: "tag-tagB", start: 70 },
      ],
      getTotalSize: () => 152 * 70,
      measureElement: () => {},
      scrollToIndex: jest.fn(),
      options: { scrollMargin: 0 },
    })
    const opsA = Array.from({ length: 75 }, (_, i) => [
      `/a${i}`,
      "get",
      `opA${i}`,
    ])
    const opsB = Array.from({ length: 75 }, (_, i) => [
      `/b${i}`,
      "get",
      `opB${i}`,
    ])
    const props = makeProps({
      getComponent: (c) => {
        if (c === "OperationTag") return TagSpy
        return dummyComponent
      },
      specSelectors: {
        taggedOperations: () =>
          makeTaggedOps([
            ["tagA", opsA],
            ["tagB", opsB],
          ]),
        validOperationMethods: () => ["get"],
        url: () => "",
      },
    })

    mount(<Operations {...props} />)

    expect(TagSpy).toHaveBeenCalledTimes(2)
  })

  it("filters out operations with invalid methods in the non-virtualized path", function () {
    const ContainerSpy = jest.fn(() => null)
    const props = makeProps({
      getComponent: (c) => {
        if (c === "OperationContainer") return ContainerSpy
        return ({ children }) => <div>{children}</div>
      },
      specSelectors: {
        taggedOperations: () =>
          makeTaggedOps([
            [
              "tagA",
              [
                ["/a", "get", "opA"],
                ["/b", "trace", "opB"],
              ],
            ],
          ]),
        validOperationMethods: () => ["get", "post"],
        url: () => "",
      },
    })

    mount(<Operations {...props} />)

    expect(ContainerSpy).toHaveBeenCalledTimes(1)
    expect(ContainerSpy.mock.calls[0][0].method).toBe("get")
  })

  it("filters out operations with invalid methods in the virtualized path", function () {
    const { useWindowVirtualizer } = jest.requireMock("@tanstack/react-virtual")
    const validOps = Array.from({ length: 149 }, (_, i) => [
      `/a${i}`,
      "get",
      `opA${i}`,
    ])
    const props = makeProps({
      specSelectors: {
        taggedOperations: () =>
          makeTaggedOps([
            ["tagA", [...validOps, ["/invalid", "trace", "traceOp"]]],
          ]),
        validOperationMethods: () => ["get"],
        url: () => "",
      },
    })

    mount(<Operations {...props} />)

    expect(useWindowVirtualizer).toHaveBeenCalledWith(
      expect.objectContaining({ count: 150 })
    )
  })

  it("OperationTag renders without children in the virtualized path", function () {
    const TagSpy = jest.fn(() => null)
    const { useWindowVirtualizer } = jest.requireMock("@tanstack/react-virtual")
    useWindowVirtualizer.mockReturnValueOnce({
      getVirtualItems: () => [{ index: 0, key: "tag-tag0", start: 0 }],
      getTotalSize: () => 150 * 70,
      measureElement: () => {},
      scrollToIndex: jest.fn(),
      options: { scrollMargin: 0 },
    })
    const ops = Array.from({ length: 149 }, (_, i) => [
      `/p${i}`,
      "get",
      `op${i}`,
    ])
    const props = makeProps({
      getComponent: (c) => {
        if (c === "OperationTag") return TagSpy
        return dummyComponent
      },
      specSelectors: {
        taggedOperations: () => makeTaggedOps([["tag0", ops]]),
        validOperationMethods: () => ["get"],
        url: () => "",
      },
    })

    mount(<Operations {...props} />)

    expect(TagSpy).toHaveBeenCalledTimes(1)
    expect(TagSpy.mock.calls[0][0].children).toBeUndefined()
  })
})
