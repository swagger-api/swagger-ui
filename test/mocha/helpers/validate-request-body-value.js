/**
 * @prettier
 */

import expect from "expect"
import { fromJS } from "immutable"
import validateRequestBodyValue from "../../../src/helpers/validate-request-body-value"

describe("validateRequestBodyValue", () => {
  it("should return true when given a Request Body and value", () => {
    const result = validateRequestBodyValue(
      fromJS({
        description: "a Request Body!",
        content: {
          "application/json": {
            schema: {
              type: "object",
            },
          },
        },
      }),
      `{ "a": 123 }`
    )

    expect(result).toBe(true)
  })

  it("should return true when given a required Request Body and value", () => {
    const result = validateRequestBodyValue(
      fromJS({
        description: "a Request Body!",
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
            },
          },
        },
      }),
      `{ "a": 123 }`
    )

    expect(result).toBe(true)
  })

  it("should return true when given a required Request Body and falsy value", () => {
    const result = validateRequestBodyValue(
      fromJS({
        description: "a Request Body!",
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "number",
            },
          },
        },
      }),
      0
    )

    expect(result).toBe(true)
  })

  it("should return false when given a required Request Body and loosely nullish values", () => {
    const requestBody = fromJS({
      description: "a Request Body!",
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "number",
          },
        },
      },
    })

    expect(validateRequestBodyValue(requestBody, "")).toBe(
      false,
      `"" input value should yield false`
    )
    expect(validateRequestBodyValue(requestBody, null)).toBe(
      false,
      `null input value should yield false`
    )
    expect(validateRequestBodyValue(requestBody, undefined)).toBe(
      false,
      `undefined input value should yield false`
    )
  })

  it("should throw a helpful error when given a badly-typed Request Body", () => {
    expect(() => validateRequestBodyValue()).toThrow(
      "Request Body must be an Immutable.js Map"
    )
  })
})
