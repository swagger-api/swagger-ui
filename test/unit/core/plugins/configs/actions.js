import expect, { createSpy, spyOn } from "expect"
import { downloadConfig } from "corePlugins/configs/spec-actions"
import { loaded } from "corePlugins/configs/actions"

describe("configs plugin - actions", () => {

  describe("downloadConfig", () => {
    it("should call the system fetch helper with a provided request", () => {
      const fetchSpy = jest.fn(async () => {})
      const system = {
        fn: {
          fetch: fetchSpy
        }
      }

      const req = {
        url: "http://swagger.io/one",
        requestInterceptor: a => a,
        responseInterceptor: a => a,
      }

      downloadConfig(req)(system)

      expect(fetchSpy).toHaveBeenCalledWith(req)
    })
  })

  describe("loaded hook", () => {
    describe("`preserveAuthorization` config and authorization data restoration", () => {
      beforeEach(() => {
        localStorage.clear()
      })    
      it("retrieve `authorized` value from `localStorage`", () => {            
        const system = {        
          getConfigs: () => ({
            persistAuthorization: true
          }),        
          authActions: {

          }
        }
        const localStorageGetSpy = spyOn(localStorage, "getItem")      
        loaded()(system)            
        expect(localStorageGetSpy.calls.length).toEqual(1)
        expect(localStorageGetSpy.calls[0].arguments[0]).toMatch("authorized")
        localStorageGetSpy.restore()    
      })
      it("restore authorization data when a value exists", () => {            
        const system = {        
          getConfigs: () => ({
            persistAuthorization: true
          }),        
          authActions: {
            restoreAuthorization: createSpy()
          }
        }
        const mockData = {"api_key": {}}
        localStorage.setItem("authorized", JSON.stringify(mockData))      
        loaded()(system)
        expect(system.authActions.restoreAuthorization.calls.length).toEqual(1)
        expect(system.authActions.restoreAuthorization.calls[0].arguments[0]).toMatch({
          authorized: mockData
        })        
      })
    })
  })
})
