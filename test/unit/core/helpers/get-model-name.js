/**
 * @prettier
 */

import Model from "../../../../src/core/plugins/json-schema-5/components/model"

describe("getModelName", () => {
  const model = new Model()

  it("should decode JSON Pointer and URI encoding for OpenAPI v3 refs", () => {
    const actual = model.getModelName("#/components/schemas/a~1b%2Bc")
    const expected = "a/b+c"

    expect(actual).toStrictEqual(expected)
  })

  it("should decode JSON Pointer and URI encoding for Swagger v2 refs", () => {
    const actual = model.getModelName(
      "#/definitions/custom%3A%3Anamespace%3A%3APerson"
    )
    const expected = "custom::namespace::Person"

    expect(actual).toStrictEqual(expected)
  })

  it("should decode multiple json-pointer values", () => {
    const actual = model.getModelName("#/components/schemas/~1~1~0~0")
    const expected = "//~~"

    expect(actual).toStrictEqual(expected)
  })

  it("should support invalid URI encoding", () => {
    const actual = model.getModelName("#/components/schemas/%25%d")
    const expected = "%25%d"

    expect(actual).toStrictEqual(expected)
  })
})
