/**
 * @prettier
 */
import React from "react"
import { List, fromJS } from "immutable"
import { render } from "enzyme"

import ParameterRow from "core/components/parameter-row"
import { getSchemaObjectTypeLabel } from "core/plugins/json-schema-5/fn"
import {
  memoizedSampleFromSchema,
  memoizedCreateXMLExample,
  mergeJsonSchema,
  getSchemaObjectType,
} from "core/plugins/json-schema-5-samples/fn/index"
import makeGetSampleSchema from "core/plugins/json-schema-5-samples/fn/get-sample-schema"
import makeGetJsonSampleSchema from "core/plugins/json-schema-5-samples/fn/get-json-sample-schema"
import makeGetYamlSampleSchema from "core/plugins/json-schema-5-samples/fn/get-yaml-sample-schema"
import makeGetXmlSampleSchema from "core/plugins/json-schema-5-samples/fn/get-xml-sample-schema"

describe("bug #10002: query parameter with oneOf schema and style:form/explode:true", function () {
  it("should generate a default value for a oneOf object parameter", function () {
    const paramValue = fromJS({
      in: "query",
      name: "parameters",
      style: "form",
      explode: true,
      schema: {
        oneOf: [
          {
            type: "object",
            properties: {
              animal: {
                type: "string",
                enum: ["dog", "cat", "bird"],
              },
              color: {
                type: "string",
                enum: ["black", "white", "multicolored"],
              },
            },
            required: ["animal"],
          },
        ],
      },
    })
    const getSystem = () => ({
      getComponent: () => "div",
      specSelectors: {
        security() {},
        parameterWithMetaByIdentity() {
          return paramValue
        },
        isOAS3() {
          return true
        },
        isSwagger2() {
          return false
        },
      },
      oas3Selectors: {
        activeExamplesMember: () => null,
      },
      getConfigs: () => {
        return {}
      },
      fn: {
        memoizedSampleFromSchema,
        memoizedCreateXMLExample,
        getSchemaObjectTypeLabel,
        getSchemaObjectType,
        getJsonSampleSchema: makeGetJsonSampleSchema(getSystem),
        getYamlSampleSchema: makeGetYamlSampleSchema(getSystem),
        getXmlSampleSchema: makeGetXmlSampleSchema(getSystem),
        getSampleSchema: makeGetSampleSchema(getSystem),
        mergeJsonSchema,
      },
    })
    const props = {
      ...getSystem(),
      operation: { get: () => {} },
      onChange: jest.fn(),
      param: paramValue,
      rawParam: paramValue,
      onChangeConsumes: () => {},
      pathMethod: [],
      specPath: List([]),
    }

    render(<ParameterRow {...props} />)

    expect(props.onChange).toHaveBeenCalled()
    const [, value] = props.onChange.mock.calls[0]
    // The value should be a stringified JSON object, not null or undefined
    expect(value).toBeDefined()
    expect(value).not.toBeNull()
    const parsed = JSON.parse(value)
    expect(typeof parsed).toBe("object")
    expect(parsed).toHaveProperty("animal")
    expect(parsed).toHaveProperty("color")
  })

  it("should generate a default value for an anyOf object parameter", function () {
    const paramValue = fromJS({
      in: "query",
      name: "filter",
      style: "form",
      explode: true,
      schema: {
        anyOf: [
          {
            type: "object",
            properties: {
              status: {
                type: "string",
                enum: ["active", "archived"],
              },
            },
          },
          {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
            },
          },
        ],
      },
    })
    const getSystem = () => ({
      getComponent: () => "div",
      specSelectors: {
        security() {},
        parameterWithMetaByIdentity() {
          return paramValue
        },
        isOAS3() {
          return true
        },
        isSwagger2() {
          return false
        },
      },
      oas3Selectors: {
        activeExamplesMember: () => null,
      },
      getConfigs: () => {
        return {}
      },
      fn: {
        memoizedSampleFromSchema,
        memoizedCreateXMLExample,
        getSchemaObjectTypeLabel,
        getSchemaObjectType,
        getJsonSampleSchema: makeGetJsonSampleSchema(getSystem),
        getYamlSampleSchema: makeGetYamlSampleSchema(getSystem),
        getXmlSampleSchema: makeGetXmlSampleSchema(getSystem),
        getSampleSchema: makeGetSampleSchema(getSystem),
        mergeJsonSchema,
      },
    })
    const props = {
      ...getSystem(),
      operation: { get: () => {} },
      onChange: jest.fn(),
      param: paramValue,
      rawParam: paramValue,
      onChangeConsumes: () => {},
      pathMethod: [],
      specPath: List([]),
    }

    render(<ParameterRow {...props} />)

    expect(props.onChange).toHaveBeenCalled()
    const [, value] = props.onChange.mock.calls[0]
    expect(value).toBeDefined()
    expect(value).not.toBeNull()
    const parsed = JSON.parse(value)
    expect(typeof parsed).toBe("object")
    expect(parsed).toHaveProperty("status")
  })

  it("should generate a default value for a oneOf parameter with $ref-like resolved schema", function () {
    // After resolution, $ref entries have $$ref markers added
    const paramValue = fromJS({
      in: "query",
      name: "parameters",
      style: "form",
      explode: true,
      schema: {
        oneOf: [
          {
            $$ref: "#/components/schemas/RequestBody",
            type: "object",
            properties: {
              animal: {
                type: "string",
                enum: ["dog", "cat", "bird"],
              },
              color: {
                type: "string",
                enum: ["black", "white", "multicolored"],
              },
            },
            required: ["animal"],
          },
        ],
      },
    })
    const getSystem = () => ({
      getComponent: () => "div",
      specSelectors: {
        security() {},
        parameterWithMetaByIdentity() {
          return paramValue
        },
        isOAS3() {
          return true
        },
        isSwagger2() {
          return false
        },
      },
      oas3Selectors: {
        activeExamplesMember: () => null,
      },
      getConfigs: () => {
        return {}
      },
      fn: {
        memoizedSampleFromSchema,
        memoizedCreateXMLExample,
        getSchemaObjectTypeLabel,
        getSchemaObjectType,
        getJsonSampleSchema: makeGetJsonSampleSchema(getSystem),
        getYamlSampleSchema: makeGetYamlSampleSchema(getSystem),
        getXmlSampleSchema: makeGetXmlSampleSchema(getSystem),
        getSampleSchema: makeGetSampleSchema(getSystem),
        mergeJsonSchema,
      },
    })
    const props = {
      ...getSystem(),
      operation: { get: () => {} },
      onChange: jest.fn(),
      param: paramValue,
      rawParam: paramValue,
      onChangeConsumes: () => {},
      pathMethod: [],
      specPath: List([]),
    }

    render(<ParameterRow {...props} />)

    expect(props.onChange).toHaveBeenCalled()
    const [, value] = props.onChange.mock.calls[0]
    expect(value).toBeDefined()
    expect(value).not.toBeNull()
    const parsed = JSON.parse(value)
    expect(typeof parsed).toBe("object")
    expect(parsed).toHaveProperty("animal")
    expect(parsed).toHaveProperty("color")
  })
})
