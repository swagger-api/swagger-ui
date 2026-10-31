/**
 * @prettier
 */
import React from "react"
import { shallow } from "enzyme"
import { fromJS, List, OrderedMap } from "immutable"

import Response from "core/components/response"
import RequestBody, {
  getDefaultRequestBodyValue,
} from "core/plugins/oas3/components/request-body"
import ModelExample from "core/plugins/json-schema-5/components/model-example"
import { getMediaTypeSchemaField as getMediaTypeSchemaFieldOAS30 } from "core/plugins/oas3/fn"
import { getMediaTypeSchemaField } from "core/plugins/oas32/oas3-extensions/fn"
import afterLoad from "core/plugins/oas32/after-load"
import {
  inferSchema,
  memoizedSampleFromSchema,
  memoizedCreateXMLExample,
} from "core/plugins/json-schema-5-samples/fn/index"
import makeGetSampleSchema from "core/plugins/json-schema-5-samples/fn/get-sample-schema"
import makeGetJsonSampleSchema from "core/plugins/json-schema-5-samples/fn/get-json-sample-schema"
import makeGetYamlSampleSchema from "core/plugins/json-schema-5-samples/fn/get-yaml-sample-schema"
import makeGetXmlSampleSchema from "core/plugins/json-schema-5-samples/fn/get-xml-sample-schema"

const eventSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    status: { type: "string" },
  },
}

describe("OAS 3.2 itemSchema", () => {
  describe("getMediaTypeSchemaField", () => {
    it("should use `itemSchema` when the media type has no `schema`", () => {
      expect(getMediaTypeSchemaField(fromJS({ itemSchema: eventSchema }))).toBe(
        "itemSchema"
      )
      expect(getMediaTypeSchemaField({ itemSchema: eventSchema })).toBe(
        "itemSchema"
      )
    })

    it("should prefer `schema` when both are present", () => {
      expect(
        getMediaTypeSchemaField(
          fromJS({ schema: { type: "string" }, itemSchema: eventSchema })
        )
      ).toBe("schema")
    })

    it("should default to `schema`", () => {
      expect(getMediaTypeSchemaField(fromJS({}))).toBe("schema")
      expect(getMediaTypeSchemaField(fromJS({ schema: eventSchema }))).toBe(
        "schema"
      )
      expect(getMediaTypeSchemaField(undefined)).toBe("schema")
      expect(getMediaTypeSchemaField(null)).toBe("schema")
    })

    it("should only use `itemSchema` for OpenAPI 3.2 documents", () => {
      const mediaType = fromJS({ itemSchema: eventSchema })
      const makeSystem = (isOAS32) => {
        const system = {
          fn: { getMediaTypeSchemaField: getMediaTypeSchemaFieldOAS30 },
          specSelectors: { isOAS32: () => isOAS32 },
          getConfigs: () => ({ fileUploadMediaTypes: [] }),
          getSystem: () => system,
        }
        const plugin = { fn: {} }
        afterLoad.call(plugin, system)
        return plugin
      }

      expect(makeSystem(true).fn.getMediaTypeSchemaField(mediaType)).toBe(
        "itemSchema"
      )
      expect(makeSystem(false).fn.getMediaTypeSchemaField(mediaType)).toBe(
        "schema"
      )
    })
  })

  const dummyComponent = () => null
  const noop = () => {}
  const components = {
    headers: dummyComponent,
    HighlightCode: dummyComponent,
    modelExample: ModelExample,
    Markdown: dummyComponent,
    operationLink: dummyComponent,
    contentType: dummyComponent,
    ExamplesSelect: dummyComponent,
    Example: dummyComponent,
    RequestBodyEditor: dummyComponent,
    ExamplesSelectValueRetainer: dummyComponent,
    ParameterIncludeEmpty: dummyComponent,
    JsonSchemaForm: dummyComponent,
  }
  const getSystem = () => ({
    getComponent: (c) => components[c],
    getConfigs: () => ({}),
    specSelectors: {
      isOAS3: () => true,
      isOAS32: () => true,
    },
    oas3Actions: {},
    fn: {
      inferSchema,
      memoizedSampleFromSchema,
      memoizedCreateXMLExample,
      getJsonSampleSchema: makeGetJsonSampleSchema(getSystem),
      getYamlSampleSchema: makeGetYamlSampleSchema(getSystem),
      getXmlSampleSchema: makeGetXmlSampleSchema(getSystem),
      getSampleSchema: makeGetSampleSchema(getSystem),
      getMediaTypeSchemaField,
      isFileUploadIntended: () => false,
      hasSchemaType: (schema, type) => schema?.get("type") === type,
    },
  })

  describe("<Response />", () => {
    const renderResponse = (content, contentType) =>
      shallow(
        <Response
          {...getSystem()}
          path="/stream"
          method="get"
          code="200"
          contentType={contentType}
          specPath={List(["paths", "/stream", "get", "responses", "200"])}
          response={fromJS({ description: "A stream", content })}
        />
      )

    it("should render the model and example of an `itemSchema`", () => {
      const wrapper = renderResponse(
        { "text/event-stream": { itemSchema: eventSchema } },
        "text/event-stream"
      )

      const modelExample = wrapper.find(ModelExample)
      expect(modelExample.length).toBe(1)
      expect(modelExample.prop("schema").toJS()).toEqual(eventSchema)
      expect(modelExample.prop("specPath").toJS()).toEqual([
        "paths",
        "/stream",
        "get",
        "responses",
        "200",
        "content",
        "text/event-stream",
        "itemSchema",
      ])
      expect(modelExample.prop("example")).not.toBeNull()
      expect(
        modelExample.prop("example").props.children.props.children
      ).toEqual(JSON.stringify({ id: "string", status: "string" }, null, 2))
      expect(wrapper.find(".response-item-schema-note").text()).toContain(
        "text/event-stream"
      )
    })

    it("should keep rendering `schema` as before", () => {
      const wrapper = renderResponse(
        { "application/json": { schema: eventSchema } },
        "application/json"
      )

      const modelExample = wrapper.find(ModelExample)
      expect(modelExample.length).toBe(1)
      expect(modelExample.prop("specPath").last()).toBe("schema")
      expect(wrapper.find(".response-item-schema-note").length).toBe(0)
    })
  })

  describe("request bodies", () => {
    const requestBody = fromJS({
      content: {
        "application/jsonl": { itemSchema: eventSchema },
        "multipart/mixed": { itemSchema: eventSchema },
      },
    })

    it("should build the default request body value from `itemSchema`", () => {
      const value = getDefaultRequestBodyValue(
        requestBody,
        "application/jsonl",
        undefined,
        getSystem().fn
      )

      expect(JSON.parse(value)).toEqual({ id: "string", status: "string" })
    })

    it("should render `itemSchema` as the request body model, never as a form", () => {
      const wrapper = shallow(
        <RequestBody
          {...getSystem()}
          requestBody={requestBody}
          requestBodyValue={OrderedMap()}
          requestBodyInclusionSetting={OrderedMap()}
          requestBodyErrors={List()}
          contentType="multipart/mixed"
          isExecute={false}
          specPath={List(["paths", "/upload", "post", "requestBody"])}
          onChange={noop}
          onChangeIncludeEmpty={noop}
          updateActiveExamplesKey={noop}
          setRetainRequestBodyValueFlag={noop}
        />
      )

      expect(wrapper.find(components.JsonSchemaForm).length).toBe(0)
      const modelExample = wrapper.find(ModelExample)
      expect(modelExample.length).toBe(1)
      expect(modelExample.prop("schema").toJS()).toEqual(eventSchema)
      expect(modelExample.prop("specPath").last()).toBe("itemSchema")
      expect(wrapper.find(".body-param-item-schema-note").text()).toContain(
        "multipart/mixed"
      )
    })
  })
})
