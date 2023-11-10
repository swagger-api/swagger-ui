
import { fromJS } from "immutable"
import { execute, executeRequest, changeParamByIdentity, updateEmptyParamInclusion } from "core/plugins/spec/actions"

describe("spec plugin - actions", function(){

  describe("execute", function(){

    xit("should collect a full request and call fn.executeRequest", function(){
      // Given
      const system = {
        fn: {
          fetch: 1
        },
        specActions: {
          executeRequest: jest.fn()
        },
        specSelectors: {
          spec: () => fromJS({spec: 1}),
          parameterValues: () => fromJS({values: 2}),
          contentTypeValues: () => fromJS({requestContentType: "one", responseContentType: "two"})
        }
      }

      // When
      let executeFn = execute({ path: "/one", method: "get"})
      executeFn(system)

      // Then
      expect(system.specActions.executeRequest.calls[0][0]).toEqual({
        fetch: 1,
        method: "get",
        pathName: "/one",
        parameters: {
          values: 2
        },
        requestContentType: "one",
        responseContentType: "two",
        spec: {
          spec: 1
        }
      })
    })

    xit("should allow passing _extra_ properties to executeRequest", function(){

      // Given
      const system = {
        fn: {},
        specActions: {
          executeRequest: jest.fn()
        },
        specSelectors: {
          spec: () => fromJS({}),
          parameterValues: () => fromJS({}),
          contentTypeValues: () => fromJS({})
        }
      }

      // When
      let executeFn = execute({ hi: "hello" })
      executeFn(system)

      // Then
      expect(system.specActions.executeRequest.calls[0][0]).toContain({hi: "hello"})
    })

  })

  describe("executeRequest", function(){

    xit("should call fn.execute with arg ", function(){

      const system = {
        fn: {
          execute: jest.fn().mockImplementation(() => Promise.resolve({}))
        },
        specActions: {
          setResponse: jest.fn()
        }
      }

      // When
      let executeFn = executeRequest({one: 1})
      let res = executeFn(system)

      // Then
      expect(res).toBeInstanceOf(Promise)
      expect(system.fn.execute.mock.calls.length).toEqual(1)
      expect(system.fn.execute.mock.calls[0][0]).toEqual({
        one: 1
      })
    })

    it("should pass requestInterceptor/responseInterceptor to fn.execute", async () => {
      // Given
      let configs = {
        requestInterceptor: jest.fn(),
        responseInterceptor: jest.fn()
      }
      const system = {
        fn: {
          buildRequest: jest.fn(),
          execute: jest.fn().mockImplementation(() => Promise.resolve({}))
        },
        specActions: {
          executeRequest: jest.fn(),
          setMutatedRequest: jest.fn(),
          setRequest: jest.fn(),
          setResponse: jest.fn()
        },
        specSelectors: {
          spec: () => fromJS({}),
          parameterValues: () => fromJS({}),
          contentTypeValues: () => fromJS({}),
          url: () => fromJS({}),
          isOAS3: () => false
        },
        getConfigs: () => configs
      }
      // When
      let executeFn = executeRequest({
        pathName: "/one",
        method: "GET",
        operation: fromJS({operationId: "getOne"})
      })
      await executeFn(system)

      // Then
      expect(system.fn.execute.mock.calls.length).toEqual(1)
      expect(Object.keys(system.fn.execute.mock.calls[0][0])).toContain("requestInterceptor")
      expect(system.fn.execute.mock.calls[0][0]).toEqual(expect.objectContaining({
        responseInterceptor: configs.responseInterceptor
      }))
      expect(system.specActions.setMutatedRequest.mock.calls.length).toEqual(0)
      expect(system.specActions.setRequest.mock.calls.length).toEqual(1)


      let wrappedRequestInterceptor = system.fn.execute.mock.calls[0][0].requestInterceptor
      await wrappedRequestInterceptor(system.fn.execute.mock.calls[0][0])
      expect(configs.requestInterceptor.mock.calls.length).toEqual(1)
      expect(system.specActions.setMutatedRequest.mock.calls.length).toEqual(1)
      expect(system.specActions.setRequest.mock.calls.length).toEqual(1)
    })
  })

  xit("should call specActions.setResponse, when fn.execute resolves", function(){

    const response = {serverResponse: true}
    const system = {
      fn: {
        execute: jest.fn().mockImplementation(() => Promise.resolve(response))
      },
      specActions: {
        setResponse: jest.fn()
      },
      errActions: {
        newSpecErr: jest.fn()
      }
    }

    // When
    let executeFn = executeRequest({
      pathName: "/one",
      method: "GET"
    })
    let executePromise = executeFn(system)

    // Then
    return executePromise.then( () => {
      expect(system.specActions.setResponse.calls.length).toEqual(1)
      expect(system.specActions.setResponse.calls[0].arguments).toEqual([
        "/one",
        "GET",
        response
      ])
    })
  })

  describe.skip("requestResolvedSubtree", () => {
    it("should return a promise ", function() {
    })
  })

  it.skip("should call errActions.newErr, if the fn.execute rejects", function(){
  })

  describe("changeParamByIdentity", function () {
    it("should map its arguments to a payload", function () {
      const pathMethod = ["/one", "get"]
      const param = fromJS({
        name: "body",
        in: "body"
      })
      const value = "my value"
      const isXml = false

      const result = changeParamByIdentity(pathMethod, param, value, isXml)

      expect(result).toEqual({
        type: "spec_update_param",
        payload: {
          path: pathMethod,
          param,
          value,
          isXml
        }
      })
    })
  })

  describe("updateEmptyParamInclusion", function () {
    it("should map its arguments to a payload", function () {
      const pathMethod = ["/one", "get"]

      const result = updateEmptyParamInclusion(pathMethod, "param", "query", true)

      expect(result).toEqual({
        type: "spec_update_empty_param_inclusion",
        payload: {
          pathMethod,
          paramName: "param",
          paramIn: "query",
          includeEmptyValue: true
        }
      })
    })
  })
})
