import { fromJS } from "immutable"
import { isOAS30, isSwagger2 } from "core/plugins/oas3/helpers"

const isOAS30Shorthand = (version) => isOAS30(fromJS({
  openapi: version
}))

const isSwagger2Shorthand = (version) => isSwagger2(fromJS({
  swagger: version
}))

describe("isOAS30", function () {
  it("should recognize valid OAS3 version values", function () {
    expect(isOAS30Shorthand("3.0.0")).toEqual(true)
    expect(isOAS30Shorthand("3.0.1")).toEqual(true)
    expect(isOAS30Shorthand("3.0.2")).toEqual(true)
    expect(isOAS30Shorthand("3.0.3")).toEqual(true)
    expect(isOAS30Shorthand("3.0.4")).toEqual(true)
    expect(isOAS30Shorthand("3.0.25")).toEqual(true)
  })

  it("should fail for invalid OAS3 version values", function () {
    expect(isOAS30Shorthand("3.0")).toEqual(false)
    expect(isOAS30Shorthand("3.0.")).toEqual(false)
    expect(isOAS30Shorthand("3.0.01")).toEqual(false)
    expect(isOAS30Shorthand("2.0")).toEqual(false)
    expect(isOAS30Shorthand("3.0.0-rc0")).toEqual(false)
  })

  it("should gracefully fail for non-string values", function () {
    expect(isOAS30Shorthand(3.0)).toEqual(false)
    expect(isOAS30Shorthand(3)).toEqual(false)
    expect(isOAS30Shorthand({})).toEqual(false)
    expect(isOAS30Shorthand(null)).toEqual(false)
  })

  it("should gracefully fail when `openapi` field is missing", function () {
    expect(isOAS30(fromJS({
      openApi: "3.0.4"
    }))).toEqual(false)
    expect(isOAS30Shorthand(null)).toEqual(false)
  })
})

describe("isSwagger2", function () {
  it("should recognize valid Swagger 2.0 version values", function () {
    expect(isSwagger2Shorthand("2.0")).toEqual(true)
  })

  it("should fail for invalid Swagger 2.0 version values", function () {
    expect(isSwagger2Shorthand("2.0-rc0")).toEqual(false)
    expect(isSwagger2Shorthand("3.0")).toEqual(false)
    expect(isSwagger2Shorthand("3.0.")).toEqual(false)
    expect(isSwagger2Shorthand("2.1")).toEqual(false)
    expect(isSwagger2Shorthand("1.2")).toEqual(false)
    expect(isSwagger2Shorthand("2")).toEqual(false)
  })

  it("should gracefully fail for non-string values", function () {
    expect(isSwagger2Shorthand(2.0)).toEqual(false)
    expect(isSwagger2Shorthand(2)).toEqual(false)
    expect(isSwagger2Shorthand({})).toEqual(false)
    expect(isSwagger2Shorthand(null)).toEqual(false)
  })

  it("should gracefully fail when `swagger` field is missing", function () {
    expect(isSwagger2(fromJS({
      Swagger: "2.0"
    }))).toEqual(false)
  })
})
