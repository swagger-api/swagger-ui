/**
 * @prettier
 */
import { fromJS } from "immutable"
import { findSchema } from "core/plugins/oas3/spec-extensions/selectors"
import { validateValues } from "core/plugins/oas3/selectors"

describe("findSchema", function () {
  const state = fromJS({
    resolvedSubtrees: {
      components: {
        schemas: {
          resolvedSchema: {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
            },
          },
        },
      },
    },
    json: {
      components: {
        schemas: {
          unresolvedSchema: {
            $ref: "#/components/schemas/resolvedSchema",
          },
          resolvedSchema: {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
            },
          },
        },
      },
    },
  })

  it("should get an unresolved schema", function () {
    const result = findSchema(state, "unresolvedSchema")

    expect(result).toEqual(
      state.getIn(["json", "components", "schemas", "unresolvedSchema"])
    )
  })

  it("should get a resolved schema", function () {
    const result = findSchema(state, "resolvedSchema")

    expect(result).toEqual(
      state.getIn([
        "resolvedSubtrees",
        "components",
        "schemas",
        "resolvedSchema",
      ])
    )
  })
})

describe("validateValues", function () {
  const oas3RequestBody = fromJS({
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            id: {
              type: "integer",
            },
            name: {
              type: "string",
            },
            nickname: {
              type: "string",
            },
            photoUrls: {
              type: "array",
              items: {
                type: "string",
              },
            },
          },
          required: ["name", "photoUrls"],
        },
      },
    },
  })

  it("should not return errors for valid values", function () {
    const oas3RequestBodyValue = JSON.stringify({
      id: 1,
      name: "name",
      photoUrls: ["url"],
    })

    const result = validateValues(fromJS({}), {
      oas3RequestBody,
      oas3RequestBodyValue,
      oas3RequestBodyInclusionSetting: fromJS({}),
      oas3RequestContentType: "application/json",
    })

    expect(result).toEqual([])
  })

  it("should return errors for invalid values when content type is application/json", function () {
    const oas3RequestBodyValue = JSON.stringify({
      id: "test",
      name: 123,
    })

    const result = validateValues(fromJS({}), {
      oas3RequestBody,
      oas3RequestBodyValue,
      oas3RequestBodyInclusionSetting: fromJS({}),
      oas3RequestContentType: "application/json",
    })

    expect(result).toEqual([
      {
        propKey: "photoUrls",
        error: "Required property not found",
      },
      {
        propKey: "id",
        error: "Value must be an integer",
      },
      {
        propKey: "name",
        error: "Value must be a string",
      },
    ])
  })

  it("should return errors for invalid values when content type is application/x-www-form-urlencoded", function () {
    const oas3RequestBodyValue = fromJS({
      id: {
        value: "test",
        errors: [],
      },
      name: {
        value: "",
        errors: [],
      },
      nickname: {
        value: "",
        errors: [],
      },
      photoUrls: {
        value: [],
        errors: [],
      },
    })

    const oas3RequestBodyInclusionSetting = fromJS({
      id: true,
      nickname: false,
    })

    const result = validateValues(fromJS({}), {
      oas3RequestBody,
      oas3RequestBodyValue,
      oas3RequestBodyInclusionSetting,
      oas3RequestContentType: "application/x-www-form-urlencoded",
    })

    expect(result).toEqual([
      {
        propKey: "name",
        error: "Required property not found",
      },
      {
        propKey: "id",
        error: "Value must be an integer",
      },
    ])
  })

  it("should return errors for invalid values when content type is application/xml", function () {
    const oas3RequestBodyValue = `<?xml version='1.0' encoding='UTF-8'?>
      <pet>
        <id>test</id>
        <photoUrls>
          <photoUrl>string</photoUrl>
        </photoUrls>
      </pet>
    `

    const result = validateValues(fromJS({}), {
      oas3RequestBody,
      oas3RequestBodyValue,
      oas3RequestBodyInclusionSetting: fromJS({}),
      oas3RequestContentType: "application/xml",
    })

    expect(result).toEqual([
      {
        propKey: "name",
        error: "Required property not found",
      },
      {
        propKey: "id",
        error: "Value must be an integer",
      },
    ])
  })
})
