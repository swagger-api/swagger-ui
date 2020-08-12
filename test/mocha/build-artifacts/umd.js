import expect from "expect"
import SwaggerUIcjs from "../../../dist/swagger-ui-bundle"
import SwaggerUIesm from "../../../dist/swagger-ui-es-bundle"
import SwaggerUIesmcore from "../../../dist/swagger-ui-es-bundle-core"

describe("webpack browser umd build", () => {
  it("should export a function for cjs", () => {
    expect(SwaggerUIcjs).toBeA(Function)
  })
  it("should export a function for esm", () => {
    expect(SwaggerUIesm).toBeA(Function)
  })
  it("should export a function for esm-core", () => {
    expect(SwaggerUIesmcore).toBeA(Function)
  })
})
