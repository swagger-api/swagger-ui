import { fromJS } from "immutable"
import { executeLink } from "core/plugins/oas3/actions"

function buildSystem({ operationMap, warnSpy } = {}) {
  const mockSpecSelectors = {
    operationById: jest.fn().mockReturnValue(operationMap),
  }
  const mockSpecActions = {
    changeParam: jest.fn(),
  }
  const mockLayoutActions = {
    show: jest.fn(),
  }
  const system = {
    specSelectors: mockSpecSelectors,
    specActions: mockSpecActions,
    layoutActions: mockLayoutActions,
  }
  return { system, mockSpecSelectors, mockSpecActions, mockLayoutActions }
}

describe("oas3 actions: executeLink", () => {
  beforeEach(() => {
    jest.useFakeTimers()
    document.body.innerHTML = ""
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("looks up the target operation and expands it under ITS OWN tag, not [path, method]", () => {
    // This is the actual bug this whole feature broke on: the real
    // expand/collapse state key is ["operations", tag, operationId] (see
    // OperationContainer.jsx's isShownKey / toggleShown), not
    // ["operations", path, method]. The wrong key silently wrote to an
    // unrelated, unread piece of layout state -- the panel never opened,
    // with no error to indicate why.
    const operationMap = fromJS({
      path: "/users/{id}",
      method: "get",
      operation: { operationId: "getUserById", tags: ["Users"] },
    })
    const { system, mockSpecSelectors, mockLayoutActions } = buildSystem({ operationMap })

    executeLink({ operationId: "getUserById", parameters: null, responseContext: null })(system)

    expect(mockSpecSelectors.operationById).toHaveBeenCalledWith("getUserById")
    expect(mockLayoutActions.show).toHaveBeenCalledWith(["operations", "Users", "getUserById"], true)
  })

  it("falls back to the 'default' tag for an untagged operation", () => {
    const operationMap = fromJS({
      path: "/",
      method: "get",
      operation: { operationId: "get_root" }, // no tags at all
    })
    const { system, mockLayoutActions } = buildSystem({ operationMap })

    executeLink({ operationId: "get_root", parameters: null, responseContext: null })(system)

    expect(mockLayoutActions.show).toHaveBeenCalledWith(["operations", "default", "get_root"], true)
  })

  it("resolves a path parameter from the response body and calls changeParam POSITIONALLY", () => {
    // The other real bug: changeParam's actual signature (spec/actions.js)
    // is (pathMethod, paramName, paramIn, value, isXml) -- a positional
    // call, not an options object, and with no isOas3 flag at all.
    // Calling it with an object instead threw deep inside the reducer
    // ("i is not iterable") because it tried to array-destructure the
    // object as if it were the [path, method] tuple it expected.
    const operationMap = fromJS({
      path: "/widgets/{id}",
      method: "get",
      operation: { operationId: "get_widgets_id", tags: ["Widgets"] },
    })
    const { system, mockSpecActions } = buildSystem({ operationMap })

    const linkPayload = {
      operationId: "get_widgets_id",
      parameters: fromJS({ id: "$response.body#/id" }),
      responseContext: fromJS({ body: { id: 2, name: "test2" } }),
    }

    executeLink(linkPayload)(system)

    expect(mockSpecActions.changeParam).toHaveBeenCalledWith(
      ["/widgets/{id}", "get"], "id", "path", "2", false
    )
  })

  it("coerces a resolved JSON number to a string before calling changeParam", () => {
    // Swagger UI's parameter state is always driven from text inputs;
    // handing it a raw JS number (as $response.body#/id resolves to,
    // straight out of JSON) breaks the same reducer the positional-args
    // fix above addresses. Isolated here since it's a genuinely separate
    // failure mode from the positional-args bug, even though both
    // produced the exact same "not iterable" error and had to be told
    // apart carefully.
    const operationMap = fromJS({
      path: "/widgets/{id}",
      method: "delete",
      operation: { operationId: "archiveWidgetLegacy", tags: ["Widgets"] },
    })
    const { system, mockSpecActions } = buildSystem({ operationMap })

    executeLink({
      operationId: "archiveWidgetLegacy",
      parameters: fromJS({ id: "$response.body#/id" }),
      responseContext: fromJS({ body: { id: 42 } }),
    })(system)

    const [, , , value] = mockSpecActions.changeParam.mock.calls[0]
    expect(typeof value).toBe("string")
    expect(value).toBe("42")
  })

  it("resolves a query parameter (not present in the path template) as paramIn 'query'", () => {
    const operationMap = fromJS({
      path: "/widgets",
      method: "get",
      operation: { operationId: "get_widgets", tags: ["Widgets"] },
    })
    const { system, mockSpecActions } = buildSystem({ operationMap })

    executeLink({
      operationId: "get_widgets",
      parameters: fromJS({ status: "active" }),
      responseContext: fromJS({ body: {} }),
    })(system)

    expect(mockSpecActions.changeParam).toHaveBeenCalledWith(
      ["/widgets", "get"], "status", "query", "active", false
    )
  })

  it("resolves a multi-segment JSON pointer against the response body", () => {
    const operationMap = fromJS({
      path: "/orders/{id}",
      method: "get",
      operation: { operationId: "getOrder", tags: ["Orders"] },
    })
    const { system, mockSpecActions } = buildSystem({ operationMap })

    executeLink({
      operationId: "getOrder",
      parameters: fromJS({ id: "$response.body#/data/id" }),
      responseContext: fromJS({ body: { data: { id: 42 } } }),
    })(system)

    expect(mockSpecActions.changeParam).toHaveBeenCalledWith(
      ["/orders/{id}", "get"], "id", "path", "42", false
    )
  })

  it("scrolls to the real DOM element operation.jsx itself renders (id via escapeDeepLinkPath)", () => {
    const operationMap = fromJS({
      path: "/widgets",
      method: "get",
      operation: { operationId: "get_widgets", tags: ["Widgets"] },
    })
    const { system } = buildSystem({ operationMap })

    // Matches exactly what operation.jsx sets:
    // id={escapeDeepLinkPath(isShownKey.join("-"))}
    const el = document.createElement("div")
    el.id = "operations-Widgets-get_widgets"
    el.scrollIntoView = jest.fn()
    document.body.appendChild(el)

    executeLink({ operationId: "get_widgets", parameters: null, responseContext: null })(system)
    jest.runAllTimers()

    expect(el.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" })
  })

  it("does not throw when the target element is not yet in the DOM", () => {
    const operationMap = fromJS({
      path: "/widgets",
      method: "get",
      operation: { operationId: "get_widgets", tags: ["Widgets"] },
    })
    const { system } = buildSystem({ operationMap })

    executeLink({ operationId: "get_widgets", parameters: null, responseContext: null })(system)
    expect(() => jest.runAllTimers()).not.toThrow()
  })

  it("warns and does nothing when the link has no operationId", () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {})
    const { system, mockSpecSelectors, mockLayoutActions, mockSpecActions } = buildSystem({})

    executeLink({ operationId: null, parameters: null, responseContext: null })(system)

    expect(warnSpy).toHaveBeenCalled()
    expect(mockSpecSelectors.operationById).not.toHaveBeenCalled()
    expect(mockLayoutActions.show).not.toHaveBeenCalled()
    expect(mockSpecActions.changeParam).not.toHaveBeenCalled()

    warnSpy.mockRestore()
  })

  it("warns and does nothing when the operationId does not resolve to a real operation", () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {})
    const { system, mockLayoutActions, mockSpecActions } = buildSystem({ operationMap: undefined })

    executeLink({ operationId: "doesNotExist", parameters: null, responseContext: null })(system)

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("doesNotExist"))
    expect(mockLayoutActions.show).not.toHaveBeenCalled()
    expect(mockSpecActions.changeParam).not.toHaveBeenCalled()

    warnSpy.mockRestore()
  })
})
