
import { execute } from "corePlugins/auth/spec-wrap-actions"

describe("spec plugin - actions", function(){

  describe("execute", function(){

    xit("should add `securities` to the oriAction call", function(){
      // Given
      const system = {
        authSelectors: {
          authorized: jest.fn().mockImplementation(() => ({
            some: "security"
          }))
        }
      }
      const oriExecute = jest.fn()

      // When
      let executeFn = execute(oriExecute, system)
      executeFn({})

      // Then
      expect(oriExecute.mock.calls.length).toEqual(1)
      expect(oriExecute.mock.calls[0][0]).toEqual({
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
