import { fromJS } from "immutable"
import { isOAS31 } from "core/plugins/oas31/fn"

const isOAS31Shorthand = (version) => isOAS31(fromJS({
  openapi: version
}))

describe("isOAS31", function () {
  it("should recognize valid OAS31 version values", function () {
    expect(isOAS31Shorthand("3.1.0")).toEqual(true)
    expect(isOAS31Shorthand("3.1.1")).toEqual(true)
    expect(isOAS31Shorthand("3.1.12")).toEqual(true)
    expect(isOAS31Shorthand("3.2.0")).toEqual(false)
    expect(isOAS31Shorthand("3.0.0-rc0")).toEqual(false)
  })
})
