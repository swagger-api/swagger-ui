import { OrderedMap, fromJS } from "immutable"
import { getDefaultRequestBodyValue } from "core/plugins/oas3/components/request-body"

describe("getDefaultRequestBodyValue", () => {
  const mockFn = {
    getSampleSchema: jest.fn((schema, mediaType, config) => {
      const result = {}
      const schemaJS = schema && typeof schema.toJS === "function" ? schema.toJS() : schema
      if (schemaJS && schemaJS.properties) {
        Object.entries(schemaJS.properties).forEach(([key, prop]) => {
          if (prop.readOnly && !config.includeReadOnly) return
          if (prop.writeOnly && !config.includeWriteOnly) return
          result[key] = prop.type === "string" ? "string" : prop.type
        })
      }
      return result
    }),
  }

  const buildRequestBody = (schema) =>
    fromJS({
      content: {
        "application/json": {
          schema,
        },
      },
    })

  const userSchema = {
    type: "object",
    properties: {
      id: { type: "string", readOnly: true },
      name: { type: "string" },
      password: { type: "string", writeOnly: true },
    },
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should include writeOnly and exclude readOnly for regular request bodies", () => {
    const requestBody = buildRequestBody(userSchema)

    getDefaultRequestBodyValue(
      requestBody,
      "application/json",
      "default",
      mockFn,
      false
    )

    expect(mockFn.getSampleSchema).toHaveBeenCalledTimes(1)
    const config = mockFn.getSampleSchema.mock.calls[0][2]
    expect(config).toEqual({ includeWriteOnly: true })
    expect(config.includeReadOnly).toBeUndefined()
  })

  it("should include readOnly and exclude writeOnly for callback request bodies", () => {
    const requestBody = buildRequestBody(userSchema)

    getDefaultRequestBodyValue(
      requestBody,
      "application/json",
      "default",
      mockFn,
      true
    )

    expect(mockFn.getSampleSchema).toHaveBeenCalledTimes(1)
    const config = mockFn.getSampleSchema.mock.calls[0][2]
    expect(config).toEqual({ includeReadOnly: true })
    expect(config.includeWriteOnly).toBeUndefined()
  })

  it("should default to non-callback behavior when isCallback is not provided", () => {
    const requestBody = buildRequestBody(userSchema)

    getDefaultRequestBodyValue(
      requestBody,
      "application/json",
      "default",
      mockFn
    )

    expect(mockFn.getSampleSchema).toHaveBeenCalledTimes(1)
    const config = mockFn.getSampleSchema.mock.calls[0][2]
    expect(config).toEqual({ includeWriteOnly: true })
  })
})
