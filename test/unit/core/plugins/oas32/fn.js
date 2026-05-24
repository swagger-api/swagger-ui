/**
 * @prettier
 */
import { fromJS } from "immutable"
import { isOAS32 } from "core/plugins/oas32/fn"

describe("oas32 plugin - fn - isOAS32", () => {
  it("should match OpenAPI 3.2.0", () => {
    const spec = fromJS({ openapi: "3.2.0" })
    expect(isOAS32(spec)).toBe(true)
  })

  it("should match OpenAPI 3.2.1", () => {
    const spec = fromJS({ openapi: "3.2.1" })
    expect(isOAS32(spec)).toBe(true)
  })

  it("should match OpenAPI 3.2.25", () => {
    const spec = fromJS({ openapi: "3.2.25" })
    expect(isOAS32(spec)).toBe(true)
  })

  it("should NOT match OpenAPI 3.2", () => {
    const spec = fromJS({ openapi: "3.2" })
    expect(isOAS32(spec)).toBe(false)
  })

  it("should NOT match OpenAPI 3.2.01 (leading zero)", () => {
    const spec = fromJS({ openapi: "3.2.01" })
    expect(isOAS32(spec)).toBe(false)
  })

  it("should NOT match OpenAPI 3.1.0", () => {
    const spec = fromJS({ openapi: "3.1.0" })
    expect(isOAS32(spec)).toBe(false)
  })

  it("should NOT match OpenAPI 3.0.3", () => {
    const spec = fromJS({ openapi: "3.0.3" })
    expect(isOAS32(spec)).toBe(false)
  })

  it("should NOT match swagger: 2.0", () => {
    const spec = fromJS({ swagger: "2.0" })
    expect(isOAS32(spec)).toBe(false)
  })

  it("should handle null spec", () => {
    const spec = fromJS({})
    expect(isOAS32(spec)).toBe(false)
  })

  it("should NOT match OpenAPI 3.3.0", () => {
    const spec = fromJS({ openapi: "3.3.0" })
    expect(isOAS32(spec)).toBe(false)
  })

  it("should NOT match OpenAPI 4.0.0", () => {
    const spec = fromJS({ openapi: "4.0.0" })
    expect(isOAS32(spec)).toBe(false)
  })
})
