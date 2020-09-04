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
    describe("authorization data restoration", () => {
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
        jest.spyOn(Object.getPrototypeOf(window.localStorage), "getItem")
        loaded()(system)            
        expect(localStorage.getItem).toHaveBeenCalled()
        expect(localStorage.getItem).toHaveBeenCalledWith("authorized")        
      })
      it("restore authorization data when a value exists", () => {            
        const system = {        
          getConfigs: () => ({
            persistAuthorization: true
          }),        
          authActions: {
            restoreAuthorization: jest.fn(() => {})
          }
        }
        const mockData = {"api_key": {}}
        localStorage.setItem("authorized", JSON.stringify(mockData))      
        loaded()(system)
        expect(system.authActions.restoreAuthorization).toHaveBeenCalled()
        expect(system.authActions.restoreAuthorization).toHaveBeenCalledWith({
          authorized: mockData
        })
      })
    })
  })
})
