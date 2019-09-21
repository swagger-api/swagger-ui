/**
 * @prettier
 */

import expect from "expect"
import Im, { fromJS } from "immutable"
import getParameterSchema from "../../../../src/helpers/get-parameter-schema"

describe("getParameterSchema", () => {
  it("should return an empty Map when given no parameters", () => {
    const result = getParameterSchema()

    expect(result).toEqual(fromJS({}))
  })

  it("should return an empty Map when given an empty Map", () => {
    const result = getParameterSchema(fromJS({}))

    expect(result).toEqual(fromJS({}))
  })

  it("should return a schema for a Swagger 2.0 query parameter", () => {
    const result = getParameterSchema(
      fromJS({
        name: "id",
        in: "query",
        description: "ID of the object to fetch",
        required: false,
        type: "array",
        items: {
          type: "string",
        },
        collectionFormat: "multi",
      })
    )

    expect(result.toJS()).toEqual({
      type: "array",
      items: {
        type: "string",
      },
    })
  })

  it("should return a schema for a Swagger 2.0 body parameter", () => {
    const result = getParameterSchema(
      fromJS({
        name: "user",
        in: "body",
        description: "user to add to the system",
        required: true,
        schema: {
          type: "array",
          items: {
            type: "string",
          },
        },
      })
    )

    expect(result.toJS()).toEqual({
      type: "array",
      items: {
        type: "string",
      },
    })
  })

  it("should return a schema for an OpenAPI 3.0 query parameter", () => {
    const result = getParameterSchema(
      fromJS({
        name: "id",
        in: "query",
        description: "ID of the object to fetch",
        required: false,
        schema: {
          type: "array",
          items: {
            type: "string",
          },
        },
        style: "form",
        explode: true,
      }),
      {
        isOAS3: true,
      }
    )

    expect(result.toJS()).toEqual({
      type: "array",
      items: {
        type: "string",
      },
    })
  })

  it("should return a schema for an OpenAPI 3.0 query parameter with `content`", () => {
    const result = getParameterSchema(
      fromJS({
        in: "query",
        name: "coordinates",
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["lat", "long"],
              properties: {
                lat: {
                  type: "number",
                },
                long: {
                  type: "number",
                },
              },
            },
            "should-ignore/the-second-media-type": {
              type: "string",
              default: "this shouldn't be returned",
            },
          },
        },
      }),
      {
        isOAS3: true,
      }
    )

    expect(result.toJS()).toEqual({
      type: "object",
      required: ["lat", "long"],
      properties: {
        lat: {
          type: "number",
        },
        long: {
          type: "number",
        },
      },
    })
  })
})
