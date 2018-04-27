/* eslint-env mocha */
import expect, { createSpy } from "expect"
import { downloadConfig } from "corePlugins/configs/spec-actions"

describe("configs plugin - actions", () => {

  describe("downloadConfig", () => {
    it("should call the system fetch helper with a provided url", () => {
      const fetchSpy = createSpy(async () => {}).andCallThrough()
      const system = {
        fn: {
          fetch: fetchSpy
        },
        getConfigs() {
          return {}
        }
      }

      const url = "http://swagger.io/one"

      downloadConfig(url)(system)

      expect(fetchSpy).toHaveBeenCalledWith({
        url: url
      })
    })
    it("should allow the globally configured requestInterceptor to modify the request", () => {
      const fetchSpy = createSpy(async () => {}).andCallThrough()
      const requestInterceptorSpy = createSpy((req) => {
        req.url = "http://swagger.io/two"
        return req
      }).andCallThrough()
      const system = {
        fn: {
          fetch: fetchSpy
        },
        getConfigs() {
          return {
            requestInterceptor: requestInterceptorSpy
          }
        }
      }

      const url = "http://swagger.io/one"

      downloadConfig(url)(system)

      expect(fetchSpy).toHaveBeenCalledWith({
        url: "http://swagger.io/two"
      })
    })
    it("should allow the globally configured responseInterceptor to modify the response", async () => {
      const fetchSpy = createSpy(async (req) => {
        return {
          url: req.url,
          ok: true
        }
      }).andCallThrough()
      const responseInterceptorSpy = createSpy((res) => {
        res.url = "http://swagger.io/two"
        return res
      }).andCallThrough()
      const system = {
        fn: {
          fetch: fetchSpy
        },
        getConfigs() {
          return {
            responseInterceptor: responseInterceptorSpy
          }
        }
      }

      const url = "http://swagger.io/one"

      const res = await downloadConfig(url)(system)

      expect(res).toEqual({
        url: "http://swagger.io/two",
        ok: true
      })
    })
  })
})
