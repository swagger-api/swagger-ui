/* eslint-env mocha */
import expect, { createSpy } from "expect"
import { configureAuth } from "corePlugins/auth/auth-wrap-actions"

describe("auth plugin - wrap actions", function(){

  describe("configureAuth", function(){
    it("should invoke toggleAuthButton and oriAction if hostname does not end with evepc.163.com", function(){
      // Given
      global.window = { location: { hostname: "esi.evetech.net"} }
      const system = {
        authActions: {
          toggleAuthButton: createSpy()
        },
        errActions: {
          newAuthErr: createSpy()
        },
        fn: {
          fetch: createSpy()
        }
      }
      const oriExecute = createSpy()

      // When
      let executeFn = configureAuth(oriExecute, system)
      executeFn({})

      // Then
      expect(oriExecute.calls.length).toEqual(1)
      expect(system.authActions.toggleAuthButton.calls.length).toEqual(1)
      expect(system.errActions.newAuthErr.calls.length).toEqual(0)
      expect(system.fn.fetch.calls.length).toEqual(0)

    })

    it("should fetch a device ID, invoke toggleAuthButton and invoke oriAction if hostname ends with evepc.163.com", function(){
      // Given
      global.window = { location: { hostname: "esi.evepc.163.com"} }
      let responseData = new Object({ok: true, data: "{\"device\": {\"id\": \"rand0m-string\"}}"})
      const fetchSpy = createSpy().andReturn(Promise.resolve(responseData))
      const system = {
        authActions: {
          toggleAuthButton: createSpy()
        },
        errActions: {
          newAuthErr: createSpy()
        },
        fn: {
          fetch: fetchSpy
        }
      }
      const oriExecute = createSpy()

      // When
      let executeFn = configureAuth(oriExecute, system)
      executeFn({additionalQueryStringParams: {}})


      // Then
      setTimeout(function () {
        expect(system.authActions.toggleAuthButton.calls.length).toEqual(1)
        expect(oriExecute.calls.length).toEqual(1)
        expect(system.fn.fetch.calls.length).toEqual(1)
        expect(system.errActions.newAuthErr.calls.length).toEqual(0)
      }, 0)
    })

    it("should throw an error if the device ID request response is not in the 2xx range", function(){
      // Given
      global.window = { location: { hostname: "esi.evepc.163.com"} }
      let responseData = new Object({ok: false})
      const fetchSpy = createSpy().andReturn(Promise.resolve(responseData))
      const system = {
        authActions: {
          toggleAuthButton: createSpy()
        },
        errActions: {
          newAuthErr: createSpy()
        },
        fn: {
          fetch: fetchSpy
        }
      }
      const oriExecute = createSpy()

      // When
      let executeFn = configureAuth(oriExecute, system)
      executeFn({})

      // Then
      setTimeout(function () {
        expect(system.authActions.toggleAuthButton.calls.length).toEqual(0)
        expect(oriExecute.calls.length).toEqual(0)
        expect(system.fn.fetch.calls.length).toEqual(1)
        expect(system.errActions.newAuthErr.calls.length).toEqual(1)
      }, 0)
    })

  })

})
