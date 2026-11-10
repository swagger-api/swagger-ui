/**
 * @prettier
 */
import React from "react"
import { shallow } from "enzyme"
import { List, fromJS } from "immutable"
import Parameters from "core/components/parameters/parameters"

describe("<Parameters/>", function () {
  describe("onChangeMediaType", function () {
    it("should reset request body value when content type changes even if user has edited body", function () {
      const setRequestBodyValue = jest.fn()
      const setRequestContentType = jest.fn()
      const initRequestBodyValidateError = jest.fn()
      const clearResponse = jest.fn()
      const clearRequest = jest.fn()
      const clearValidateParams = jest.fn()

      const props = {
        parameters: List(),
        operation: fromJS({ operationId: "testOp" }),
        specActions: {
          changeParamByIdentity: jest.fn(),
          clearResponse,
          clearRequest,
          clearValidateParams,
        },
        oas3Actions: {
          setRequestContentType,
          setRequestBodyValue,
          initRequestBodyValidateError,
        },
        oas3Selectors: {
          hasUserEditedBody: () => true,
          shouldRetainRequestBodyValue: () => false,
          requestContentType: () => "application/json",
          requestBodyValue: () => '{"foo":"bar"}',
          activeExamplesMember: () => null,
        },
        specSelectors: {
          isOAS3: () => true,
          specResolvedSubtree: () => fromJS({}),
        },
        getComponent: () => "div",
        getConfigs: () => ({}),
        fn: {},
        pathMethod: ["/pet", "put"],
        specPath: List(["paths", "/pet", "put"]),
      }

      const wrapper = shallow(<Parameters {...props} />)
      const instance = wrapper.instance()

      instance.onChangeMediaType({
        value: "application/xml",
        pathMethod: ["/pet", "put"],
      })

      expect(setRequestContentType).toHaveBeenCalledWith({
        value: "application/xml",
        pathMethod: ["/pet", "put"],
      })
      expect(setRequestBodyValue).toHaveBeenCalledWith({
        value: undefined,
        pathMethod: ["/pet", "put"],
      })
      expect(clearResponse).toHaveBeenCalledWith("/pet", "put")
      expect(clearRequest).toHaveBeenCalledWith("/pet", "put")
      expect(clearValidateParams).toHaveBeenCalledWith(["/pet", "put"])
    })

    it("should not reset request body value when shouldRetainRequestBodyValue is true", function () {
      const setRequestBodyValue = jest.fn()
      const setRequestContentType = jest.fn()
      const initRequestBodyValidateError = jest.fn()
      const clearResponse = jest.fn()
      const clearRequest = jest.fn()
      const clearValidateParams = jest.fn()

      const props = {
        parameters: List(),
        operation: fromJS({ operationId: "testOp" }),
        specActions: {
          changeParamByIdentity: jest.fn(),
          clearResponse,
          clearRequest,
          clearValidateParams,
        },
        oas3Actions: {
          setRequestContentType,
          setRequestBodyValue,
          initRequestBodyValidateError,
        },
        oas3Selectors: {
          hasUserEditedBody: () => true,
          shouldRetainRequestBodyValue: () => true,
          requestContentType: () => "application/json",
          requestBodyValue: () => '{"foo":"bar"}',
          activeExamplesMember: () => null,
        },
        specSelectors: {
          isOAS3: () => true,
          specResolvedSubtree: () => fromJS({}),
        },
        getComponent: () => "div",
        getConfigs: () => ({}),
        fn: {},
        pathMethod: ["/pet", "put"],
        specPath: List(["paths", "/pet", "put"]),
      }

      const wrapper = shallow(<Parameters {...props} />)
      const instance = wrapper.instance()

      instance.onChangeMediaType({
        value: "application/xml",
        pathMethod: ["/pet", "put"],
      })

      expect(setRequestContentType).toHaveBeenCalledWith({
        value: "application/xml",
        pathMethod: ["/pet", "put"],
      })
      expect(setRequestBodyValue).not.toHaveBeenCalled()
      expect(clearResponse).toHaveBeenCalledWith("/pet", "put")
      expect(clearRequest).toHaveBeenCalledWith("/pet", "put")
      expect(clearValidateParams).toHaveBeenCalledWith(["/pet", "put"])
    })
  })
})
