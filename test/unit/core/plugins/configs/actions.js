import { downloadConfig } from "corePlugins/configs/spec-actions"

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
})
