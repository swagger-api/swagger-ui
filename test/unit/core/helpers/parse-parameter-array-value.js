/**
 * @prettier
 */

import { List, fromJS } from "immutable"
import { parseParameterArrayValue } from "../../../../src/core/utils/parse-parameter-array-value"

describe("parseParameterArrayValue", () => {
  it("should return null when given no value", () => {
    const result = parseParameterArrayValue()

    expect(result).toBe(null)
  })

  it("should return a List when given a List", () => {
    const result = parseParameterArrayValue(fromJS(["a", "b", "c"]))

    expect(List.isList(result)).toBe(true)
    expect(result.toJS()).toEqual(["a", "b", "c"])
  })

  it("should return null when given a non-string value", () => {
    const result = parseParameterArrayValue(fromJS({ a: 1, b: 2 }))

    expect(result).toBe(null)
  })

  it("should return a List when given a JSON string representing an array", () => {
    const result = parseParameterArrayValue('["a", "b", "c"]')

    expect(List.isList(result)).toBe(true)
    expect(result.toJS()).toEqual(["a", "b", "c"])
  })

  it("should return null when given a JSON string representing a non-array value", () => {
    const result = parseParameterArrayValue('{"a": 1, "b": 2}')

    expect(result).toBe(null)
  })

  it("should return null when given an invalid JSON string", () => {
    const result = parseParameterArrayValue('["a", "b", "c"')

    expect(result).toBe(null)
  })
})
