/* eslint-env mocha */
import expect, { createSpy } from "expect"
import { fromJS } from "immutable"
import { execute, executeRequest } from "corePlugins/spec/actions"

describe("spec plugin - actions", function(){

  describe("execute", function(){

    xit("should collect a full request and call fn.executeRequest", function(){
      // Given
      const system = {
        fn: {
          fetch: 1
        },
        specActions: {
          executeRequest: createSpy()
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
      expect(system.specActions.executeRequest.calls[0].arguments[0]).toEqual({
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
          executeRequest: createSpy()
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
      expect(system.specActions.executeRequest.calls[0].arguments[0]).toInclude({hi: "hello"})
    })

  })

  describe("executeRequest", function(){

    xit("should call fn.execute with arg ", function(){

      const system = {
        fn: {
          execute: createSpy().andReturn(Promise.resolve())
        },
        specActions: {
          setResponse: createSpy()
        }
      }

      // When
      let executeFn = executeRequest({one: 1})
      let res = executeFn(system)

      // Then
      expect(res).toBeA(Promise)
      expect(system.fn.execute.calls.length).toEqual(1)
      expect(system.fn.execute.calls[0].arguments[0]).toEqual({
        one: 1
      })
    })

  })

  xit("should call specActions.setResponse, when fn.execute resolves", function(){

    const response = {serverResponse: true}
    const system = {
      fn: {
        execute: createSpy().andReturn(Promise.resolve(response))
      },
      specActions: {
        setResponse: createSpy()
      },
      errActions: {
        newSpecErr: createSpy()
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

  it.skip("should call errActions.newErr, if the fn.execute rejects", function(){
  })

})
