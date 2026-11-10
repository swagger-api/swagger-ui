import { fromJS } from "immutable"
import { isOAS31 } from "core/plugins/oas31/fn"
import { stringifyConstraints } from "core/plugins/json-schema-2020-12/fn"

const isOAS31Shorthand = (version) => isOAS31(fromJS({
  openapi: version
}))


describe("isOAS30", function () {
  it("should recognize valid OAS3 version values", function () {
    expect(isOAS31Shorthand("3.1.0")).toEqual(true)
    expect(isOAS31Shorthand("3.1.1")).toEqual(true)
    expect(isOAS31Shorthand("3.1.2")).toEqual(true)
    expect(isOAS31Shorthand("3.1.25")).toEqual(true)
  })

  it("should fail for invalid OAS3 version values", function () {
    expect(isOAS31Shorthand("3.1")).toEqual(false)
    expect(isOAS31Shorthand("3.1.")).toEqual(false)
    expect(isOAS31Shorthand("3.1.01")).toEqual(false)
    expect(isOAS31Shorthand("2.0")).toEqual(false)

  })

  it("should gracefully fail for non-string values", function () {
    expect(isOAS31Shorthand(3.0)).toEqual(false)
    expect(isOAS31Shorthand(3)).toEqual(false)
    expect(isOAS31Shorthand({})).toEqual(false)
    expect(isOAS31Shorthand(null)).toEqual(false)
  })

  it("should gracefully fail when `openapi` field is missing", function () {
    expect(isOAS31(fromJS({
      openApi: "3.1.0"
    }))).toEqual(false)
    expect(isOAS31Shorthand(null)).toEqual(false)
  })
})

describe("stringifyConstraints", function () {
  it.each([
    [1e-7, "1/10000000"],
    [1.2e-7, "12/100000000"]
  ])("handles a scientific-notation multipleOf", function (multipleOf, ratio) {
    expect(stringifyConstraints({ multipleOf })).toEqual([
      { scope: "number", value: `multiple of ${ratio}` }
    ])
  })
})
