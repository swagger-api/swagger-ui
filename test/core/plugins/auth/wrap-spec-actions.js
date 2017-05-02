/* eslint-env mocha */
import expect, { createSpy } from "expect"
import { execute } from "corePlugins/auth/spec-wrap-actions"

describe("spec plugin - actions", function(){

  describe("execute", function(){

    xit("should add `securities` to the oriAction call", function(){
      // Given
      const system = {
        authSelectors: {
          authorized: createSpy().andReturn({some: "security"})
        }
      }
      const oriExecute = createSpy()

      // When
      let executeFn = execute(oriExecute, system)
      executeFn({})

      // Then
      expect(oriExecute.calls.length).toEqual(1)
      expect(oriExecute.calls[0].arguments[0]).toEqual({
        extras: {
          security: {
            some: "security"
          }
        },
        method: undefined,
        path: undefined,
        operation: undefined
      })

    })

  })

})
