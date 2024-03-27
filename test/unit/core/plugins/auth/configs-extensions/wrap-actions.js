import { loaded } from "core/plugins/auth/configs-extensions/wrap-actions"

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

      loaded(jest.fn(), system)()
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
      loaded(jest.fn(), system)()
      expect(system.authActions.restoreAuthorization).toHaveBeenCalled()
      expect(system.authActions.restoreAuthorization).toHaveBeenCalledWith({
        authorized: mockData
      })
    })
  })
})
