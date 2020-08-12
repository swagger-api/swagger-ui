import expect from "expect"
import SwaggerUI from "../../../dist/swagger-ui-es-bundle"

describe("webpack browser es-bundle build", () => {
  it("should export a function for es-bundle", () => {
    expect(SwaggerUI).toBeA(Function)
  })
})
