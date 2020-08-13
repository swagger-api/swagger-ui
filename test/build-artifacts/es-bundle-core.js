import expect from "expect"
import SwaggerUI from "../../dist/swagger-ui-es-bundle-core"

describe("webpack browser es-bundle-core build", () => {
  it("should export a function for es-bundle-core", () => {
    expect(SwaggerUI).toBeA(Function)
  })
})
