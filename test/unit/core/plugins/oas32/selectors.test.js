/**
 * @prettier
 */
import { validOperationMethods } from "core/plugins/oas32/selectors"

describe("oas32 plugin - selectors", () => {
  describe("validOperationMethods", () => {
    it("should return an array of valid operation methods", () => {
      const result = validOperationMethods()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(9)
    })

    it("should include standard HTTP methods", () => {
      const result = validOperationMethods()
      expect(result).toContain("get")
      expect(result).toContain("put")
      expect(result).toContain("post")
      expect(result).toContain("delete")
      expect(result).toContain("options")
      expect(result).toContain("head")
      expect(result).toContain("patch")
      expect(result).toContain("trace")
    })

    it("should include QUERY method for OAS 3.2", () => {
      const result = validOperationMethods()
      expect(result).toContain("query")
    })

    it("should return the same array reference on multiple calls", () => {
      const result1 = validOperationMethods()
      const result2 = validOperationMethods()
      expect(result1).toBe(result2)
    })
  })
})
