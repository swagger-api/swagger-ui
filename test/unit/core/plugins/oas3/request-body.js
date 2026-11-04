/**
 * @prettier
 */
import { fromJS, OrderedMap } from "immutable"
import { getOneOfExamples } from "core/plugins/oas3/components/request-body"
import {
  sampleFromSchema,
  mergeJsonSchema,
  memoizedSampleFromSchema,
  memoizedCreateXMLExample,
} from "core/plugins/json-schema-5-samples/fn/index"
import makeGetSampleSchema from "core/plugins/json-schema-5-samples/fn/get-sample-schema"
import makeGetJsonSampleSchema from "core/plugins/json-schema-5-samples/fn/get-json-sample-schema"
import makeGetYamlSampleSchema from "core/plugins/json-schema-5-samples/fn/get-yaml-sample-schema"
import makeGetXmlSampleSchema from "core/plugins/json-schema-5-samples/fn/get-xml-sample-schema"

const getSystem = () => ({
  fn: {
    memoizedSampleFromSchema,
    memoizedCreateXMLExample,
    mergeJsonSchema,
    sampleFromSchema,
    getJsonSampleSchema: makeGetJsonSampleSchema(getSystem),
    getYamlSampleSchema: makeGetYamlSampleSchema(getSystem),
    getXmlSampleSchema: makeGetXmlSampleSchema(getSystem),
    getSampleSchema: makeGetSampleSchema(getSystem),
  },
})

const buildRequestBody = (schema, extras = {}) =>
  fromJS({
    content: {
      "application/json": {
        schema,
        ...extras,
      },
    },
  })

describe("getOneOfExamples", () => {
  const { fn } = getSystem()
  const mediaType = "application/json"

  describe("when schema has oneOf with multiple variants", () => {
    const schema = {
      oneOf: [
        {
          title: "RegisteredUser",
          type: "object",
          properties: {
            userType: { type: "string", example: "registered" },
            username: { type: "string", example: "john_doe" },
          },
        },
        {
          title: "GuestUser",
          type: "object",
          properties: {
            userType: { type: "string", example: "guest" },
            displayName: { type: "string", example: "Guest-42" },
          },
        },
      ],
    }
    const requestBody = buildRequestBody(schema)

    it("returns an OrderedMap with one entry per variant", () => {
      const result = getOneOfExamples(requestBody, mediaType, fn)
      expect(OrderedMap.isOrderedMap(result)).toBe(true)
      expect(result.size).toBe(2)
    })

    it("uses the variant title as the map key and summary", () => {
      const result = getOneOfExamples(requestBody, mediaType, fn)
      expect(result.has("RegisteredUser")).toBe(true)
      expect(result.has("GuestUser")).toBe(true)
      expect(result.getIn(["RegisteredUser", "summary"])).toBe("RegisteredUser")
      expect(result.getIn(["GuestUser", "summary"])).toBe("GuestUser")
    })

    it("generates a distinct value for each variant", () => {
      const result = getOneOfExamples(requestBody, mediaType, fn)
      const registeredValue = result.getIn(["RegisteredUser", "value"])
      const guestValue = result.getIn(["GuestUser", "value"])
      expect(registeredValue).not.toEqual(guestValue)
    })

    it("each value contains the properties of its variant", () => {
      const result = getOneOfExamples(requestBody, mediaType, fn)
      const registered = JSON.parse(result.getIn(["RegisteredUser", "value"]))
      const guest = JSON.parse(result.getIn(["GuestUser", "value"]))
      expect(registered).toHaveProperty("username")
      expect(guest).toHaveProperty("displayName")
    })
  })

  describe("when variant has no title but has a resolved $$ref", () => {
    const schema = {
      oneOf: [
        {
          $$ref: "#/components/schemas/RegisteredUser",
          type: "object",
          properties: { username: { type: "string" } },
        },
        {
          $$ref: "#/components/schemas/GuestUser",
          type: "object",
          properties: { displayName: { type: "string" } },
        },
      ],
    }
    const requestBody = buildRequestBody(schema)

    it("extracts the schema name from $$ref as the key", () => {
      const result = getOneOfExamples(requestBody, mediaType, fn)
      expect(result.has("RegisteredUser")).toBe(true)
      expect(result.has("GuestUser")).toBe(true)
    })
  })

  describe("when variant has no title and no $$ref", () => {
    const schema = {
      oneOf: [
        { type: "object", properties: { a: { type: "string" } } },
        { type: "object", properties: { b: { type: "integer" } } },
      ],
    }
    const requestBody = buildRequestBody(schema)

    it("falls back to 'oneOf[index]' as the key", () => {
      const result = getOneOfExamples(requestBody, mediaType, fn)
      expect(result.has("oneOf[0]")).toBe(true)
      expect(result.has("oneOf[1]")).toBe(true)
    })
  })

  describe("when variant has x-summary extension", () => {
    const schema = {
      anyOf: [
        {
          "x-summary": "Option A",
          type: "object",
          properties: { a: { type: "string" } },
        },
        {
          "x-summary": "Option B",
          type: "object",
          properties: { b: { type: "string" } },
        },
      ],
    }
    const requestBody = buildRequestBody(schema)

    it("uses x-summary as the key when no title is present", () => {
      const result = getOneOfExamples(requestBody, mediaType, fn)
      expect(result.has("Option A")).toBe(true)
      expect(result.has("Option B")).toBe(true)
    })
  })

  describe("when schema has anyOf with multiple variants", () => {
    it("falls back to 'anyOf[index]' keys when no titles are present", () => {
      const schema = {
        anyOf: [
          { type: "object", properties: { a: { type: "string" } } },
          { type: "object", properties: { b: { type: "string" } } },
        ],
      }
      const result = getOneOfExamples(buildRequestBody(schema), mediaType, fn)
      expect(result.has("anyOf[0]")).toBe(true)
      expect(result.has("anyOf[1]")).toBe(true)
    })
  })

  describe("when schema has only one variant", () => {
    it("returns null (no dropdown needed for a single option)", () => {
      const schema = {
        oneOf: [
          {
            title: "OnlyOne",
            type: "object",
            properties: { a: { type: "string" } },
          },
        ],
      }
      const result = getOneOfExamples(buildRequestBody(schema), mediaType, fn)
      expect(result).toBeNull()
    })
  })

  describe("when schema has no oneOf or anyOf", () => {
    it("returns null", () => {
      const schema = {
        type: "object",
        properties: { name: { type: "string" } },
      }
      const result = getOneOfExamples(buildRequestBody(schema), mediaType, fn)
      expect(result).toBeNull()
    })
  })

  describe("when explicit examples are already present on the media type", () => {
    it("returns null and defers to the spec-defined examples", () => {
      const schema = {
        oneOf: [
          { title: "A", type: "object", properties: { a: { type: "string" } } },
          { title: "B", type: "object", properties: { b: { type: "string" } } },
        ],
      }
      const requestBody = buildRequestBody(schema, {
        examples: {
          myExample: { summary: "My example", value: { a: "hello" } },
        },
      })
      const result = getOneOfExamples(requestBody, mediaType, fn)
      expect(result).toBeNull()
    })
  })

  describe("when parent schema has shared properties alongside oneOf", () => {
    it("merges parent properties into each variant's generated sample", () => {
      const schema = {
        type: "object",
        properties: {
          id: { type: "integer", example: 42 },
        },
        oneOf: [
          {
            title: "TypeA",
            type: "object",
            properties: { kindA: { type: "string", example: "a" } },
          },
          {
            title: "TypeB",
            type: "object",
            properties: { kindB: { type: "string", example: "b" } },
          },
        ],
      }
      const result = getOneOfExamples(buildRequestBody(schema), mediaType, fn)
      const typeA = JSON.parse(result.getIn(["TypeA", "value"]))
      const typeB = JSON.parse(result.getIn(["TypeB", "value"]))
      expect(typeA).toHaveProperty("id", 42)
      expect(typeB).toHaveProperty("id", 42)
      expect(typeA).toHaveProperty("kindA")
      expect(typeB).toHaveProperty("kindB")
    })
  })
})
