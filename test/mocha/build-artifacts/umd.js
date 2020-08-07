import expect from "expect"
import SwaggerUI from "../../../dist/swagger-ui-bundle"

describe("webpack browser umd build", () => {
  it("should export a function", () => {
    expect(SwaggerUI).toBeA(Function)
  })
})
