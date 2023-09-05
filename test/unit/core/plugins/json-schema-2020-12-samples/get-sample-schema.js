/**
 * @prettier
 */
import {
  memoizedSampleFromSchema,
  memoizedCreateXMLExample,
} from "core/plugins/json-schema-2020-12-samples/fn/index"
import makeGetSampleSchema from "core/plugins/json-schema-2020-12-samples/fn/get-sample-schema"
import makeGetJsonSampleSchema from "core/plugins/json-schema-2020-12-samples/fn/get-json-sample-schema"
import makeGetYamlSampleSchema from "core/plugins/json-schema-2020-12-samples/fn/get-yaml-sample-schema"
import makeGetXmlSampleSchema from "core/plugins/json-schema-2020-12-samples/fn/get-xml-sample-schema"

describe("getSampleSchema", () => {
  const oriDate = Date
  const getSystem = () => ({
    fn: {
      jsonSchema202012: {
        memoizedSampleFromSchema,
        memoizedCreateXMLExample,
        getJsonSampleSchema: makeGetJsonSampleSchema(getSystem),
        getYamlSampleSchema: makeGetYamlSampleSchema(getSystem),
        getXmlSampleSchema: makeGetXmlSampleSchema(getSystem),
      },
    },
  })
  const getSampleSchema = makeGetSampleSchema(getSystem)

  beforeEach(() => {
    Date = function () {
      this.toISOString = function () {
        return "2018-07-07T07:07:05.189Z"
      }
    }
  })

  afterEach(() => {
    Date = oriDate
  })

  it("should stringify string values if json content-type", () => {
    // Given
    const res = getSampleSchema(
      {
        type: "string",
        format: "date-time",
      },
      "text/json"
    )

    // Then
    expect(res).toEqual(JSON.stringify(new Date().toISOString()))
  })

  it("should not unnecessarily stringify string values for other content-types", () => {
    // Given
    const res = getSampleSchema({
      type: "string",
      format: "date-time",
    })

    // Then
    expect(res).toEqual(new Date().toISOString())
  })

  it("should not unnecessarily stringify non-object values", () => {
    // Given
    const res = getSampleSchema({
      type: "number",
    })

    // Then
    expect(res).toEqual(0)
  })

  it("should not unnecessarily stringify non-object values if content-type is json", () => {
    // Given
    const res = getSampleSchema(
      {
        type: "number",
      },
      "application/json"
    )

    // Then
    expect(res).toEqual(0)
  })

  it("should stringify object when literal string example is provided if json content-type", () => {
    // Given
    const expected = "<MyObject></MyObject>"
    const res = getSampleSchema(
      {
        type: "object",
      },
      "text/json",
      {},
      expected
    )

    // Then
    expect(res).toEqual(JSON.stringify(expected))
  })

  it("should parse valid json literal example if json content-type", () => {
    // Given
    const expected = { test: 123 }
    const res = getSampleSchema(
      {
        type: "object",
      },
      "text/json",
      {},
      JSON.stringify(expected)
    )

    // Then
    const actual = JSON.parse(res)
    expect(actual.test).toEqual(123)
  })

  it("should handle number example with string schema as string", () => {
    // Given
    const expected = 123
    const res = getSampleSchema(
      {
        type: "string",
      },
      "text/json",
      {},
      expected
    )

    // Then
    const actual = JSON.parse(res)
    expect(actual).toEqual("123")
  })

  it("should handle number literal example with string schema as string", () => {
    // Given
    const expected = "123"
    const res = getSampleSchema(
      {
        type: "string",
      },
      "text/json",
      {},
      expected
    )

    // Then
    const actual = JSON.parse(res)
    expect(actual).toEqual("123")
  })

  it("should handle number literal example with number schema as number", () => {
    // Given
    const expected = "123"
    const res = getSampleSchema(
      {
        type: "number",
      },
      "text/json",
      {},
      expected
    )

    // Then
    const actual = JSON.parse(res)
    expect(actual).toEqual(123)
  })

  it("should return yaml example if yaml is contained in the content-type", () => {
    const res = getSampleSchema(
      {
        type: "object",
      },
      "text/yaml",
      {},
      { test: 123 }
    )

    expect(res).toEqual("test: 123")
  })

  it("should return yaml example if yml is contained in the content-type", () => {
    const res = getSampleSchema(
      {
        type: "object",
      },
      "text/yml",
      {},
      { test: 123 }
    )

    expect(res).toEqual("test: 123")
  })
})
