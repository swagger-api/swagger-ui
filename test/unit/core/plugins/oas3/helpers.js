import { fromJS } from "immutable"
import { isOAS30, isSwagger2 } from "core/plugins/oas3/helpers"

const isOAS3Shorthand = (version) => isOAS30(fromJS({
  openapi: version
}))

const isSwagger2Shorthand = (version) => isSwagger2(fromJS({
  swagger: version
}))

describe("isOAS3", function () {
  it("should recognize valid OAS3 version values", function () {
    expect(isOAS3Shorthand("3.0.0")).toEqual(true)
    expect(isOAS3Shorthand("3.0.1")).toEqual(true)
    expect(isOAS3Shorthand("3.0.11111")).toEqual(false)
    expect(isOAS3Shorthand("3.0.0-rc0")).toEqual(true)
  })

  it("should fail for invalid OAS3 version values", function () {
    expect(isOAS3Shorthand("3.0")).toEqual(false)
    expect(isOAS3Shorthand("3.0.")).toEqual(false)
    expect(isOAS3Shorthand("2.0")).toEqual(false)
  })

  it("should gracefully fail for non-string values", function () {
    expect(isOAS3Shorthand(3.0)).toEqual(false)
    expect(isOAS3Shorthand(3)).toEqual(false)
    expect(isOAS3Shorthand({})).toEqual(false)
    expect(isOAS3Shorthand(null)).toEqual(false)
  })

  it("should gracefully fail when `openapi` field is missing", function () {
    expect(isOAS30(fromJS({
      openApi: "3.0.0"
    }))).toEqual(false)
    expect(isOAS3Shorthand(null)).toEqual(false)
  })
})

describe("isSwagger2", function () {
  it("should recognize valid Swagger 2.0 version values", function () {
    expect(isSwagger2Shorthand("2.0")).toEqual(true)
    expect(isSwagger2Shorthand("2.0-rc0")).toEqual(false)
  })

  it("should fail for invalid Swagger 2.0 version values", function () {
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
