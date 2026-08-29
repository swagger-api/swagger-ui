/**
 * @prettier
 */
import React from "react"
import { fromJS, List } from "immutable"
import { render } from "enzyme"
import Operation from "core/components/operation"

describe("bug #7430: parameters with same name but different 'in' values", function () {
  it("should display both path-level and operation-level parameters when they share the same name but have different 'in' values", function () {
    const parametersMock = []

    // eslint-disable-next-line react/prop-types
    const MockParameters = ({ parameters }) => {
      parametersMock.push(parameters)
      return <div className="parameters" />
    }

    const operationProps = fromJS({
      op: {
        description: "Get a pet",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "The pet ID in path",
            required: true,
            type: "string",
          },
        ],
        responses: {
          200: { description: "OK" },
        },
      },
      deprecated: false,
      isShown: true,
      path: "/pets/{id}",
      method: "get",
      tag: "default",
      operationId: "getPet",
      showSummary: true,
      jumpToKey: "paths./pets/{id}.get",
      allowTryItOut: true,
      displayRequestDuration: false,
      isDeepLinkingEnabled: false,
      executeInProgress: false,
      tryItOutEnabled: false,
    })

    const props = {
      operation: operationProps,
      specPath: List(["paths", "/pets/{id}", "get"]),
      response: null,
      request: null,
      toggleShown: jest.fn(),
      onTryoutClick: jest.fn(),
      onResetClick: jest.fn(),
      onCancelClick: jest.fn(),
      onExecute: jest.fn(),
      getComponent: (name) => {
        if (name === "parameters") return MockParameters
        return "div"
      },
      getConfigs: () => ({
        showExtensions: false,
      }),
      specActions: {},
      specSelectors: {
        isOAS3() {
          return false
        },
        operationScheme() {
          return "https"
        },
        specJson() {
          return fromJS({
            paths: {
              "/pets/{id}": {
                parameters: [
                  {
                    name: "id",
                    in: "header",
                    description: "The pet ID in header",
                    required: false,
                    type: "string",
                  },
                ],
              },
            },
          })
        },
      },
      oas3Actions: {},
      oas3Selectors: {
        selectedServer() {
          return ""
        },
      },
      authActions: {},
      authSelectors: {},
      layoutActions: {},
      layoutSelectors: {},
      fn: {},
    }

    render(<Operation {...props} />)

    expect(parametersMock.length).toBeGreaterThan(0)
    const parameters = parametersMock[0]
    expect(parameters.size).toEqual(2)
    expect(parameters.getIn([0, "name"])).toEqual("id")
    expect(parameters.getIn([0, "in"])).toEqual("path")
    expect(parameters.getIn([1, "name"])).toEqual("id")
    expect(parameters.getIn([1, "in"])).toEqual("header")
  })

  it("should NOT duplicate parameters when path-level and operation-level share same name AND same 'in'", function () {
    const parametersMock = []

    // eslint-disable-next-line react/prop-types
    const MockParameters = ({ parameters }) => {
      parametersMock.push(parameters)
      return <div className="parameters" />
    }

    const operationProps = fromJS({
      op: {
        description: "Get a pet",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Operation-level id param",
            required: true,
            type: "string",
          },
        ],
        responses: {
          200: { description: "OK" },
        },
      },
      deprecated: false,
      isShown: true,
      path: "/pets/{id}",
      method: "get",
      tag: "default",
      operationId: "getPet",
      showSummary: true,
      jumpToKey: "paths./pets/{id}.get",
      allowTryItOut: true,
      displayRequestDuration: false,
      isDeepLinkingEnabled: false,
      executeInProgress: false,
      tryItOutEnabled: false,
    })

    const props = {
      operation: operationProps,
      specPath: List(["paths", "/pets/{id}", "get"]),
      response: null,
      request: null,
      toggleShown: jest.fn(),
      onTryoutClick: jest.fn(),
      onResetClick: jest.fn(),
      onCancelClick: jest.fn(),
      onExecute: jest.fn(),
      getComponent: (name) => {
        if (name === "parameters") return MockParameters
        return "div"
      },
      getConfigs: () => ({
        showExtensions: false,
      }),
      specActions: {},
      specSelectors: {
        isOAS3() {
          return false
        },
        operationScheme() {
          return "https"
        },
        specJson() {
          return fromJS({
            paths: {
              "/pets/{id}": {
                parameters: [
                  {
                    name: "id",
                    in: "path",
                    description: "Path-level id param",
                    required: true,
                    type: "string",
                  },
                ],
              },
            },
          })
        },
      },
      oas3Actions: {},
      oas3Selectors: {
        selectedServer() {
          return ""
        },
      },
      authActions: {},
      authSelectors: {},
      layoutActions: {},
      layoutSelectors: {},
      fn: {},
    }

    render(<Operation {...props} />)

    expect(parametersMock.length).toBeGreaterThan(0)
    const parameters = parametersMock[0]
    expect(parameters.size).toEqual(1)
    expect(parameters.getIn([0, "name"])).toEqual("id")
    expect(parameters.getIn([0, "in"])).toEqual("path")
    expect(parameters.getIn([0, "description"])).toEqual(
      "Operation-level id param"
    )
  })
})
