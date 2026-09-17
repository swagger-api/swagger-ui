/**
 * @prettier
 */
import React from "react"
import { shallow } from "enzyme"
import { fromJS, List } from "immutable"

import Response from "core/components/response"
import ModelExample from "core/plugins/json-schema-5/components/model-example"
import {
  inferSchema,
  memoizedSampleFromSchema,
  memoizedCreateXMLExample,
} from "core/plugins/json-schema-5-samples/fn/index"
import makeGetSampleSchema from "core/plugins/json-schema-5-samples/fn/get-sample-schema"
import makeGetJsonSampleSchema from "core/plugins/json-schema-5-samples/fn/get-json-sample-schema"
import makeGetYamlSampleSchema from "core/plugins/json-schema-5-samples/fn/get-yaml-sample-schema"
import makeGetXmlSampleSchema from "core/plugins/json-schema-5-samples/fn/get-xml-sample-schema"
import { makeIsFileUploadIntended } from "core/plugins/oas3/fn"

describe("<Response /> file-upload media types", function () {
  const dummyComponent = () => null
  const components = {
    headers: dummyComponent,
    highlightCode: dummyComponent,
    modelExample: ModelExample,
    Markdown: dummyComponent,
    operationLink: dummyComponent,
    contentType: dummyComponent,
  }
  const buildSystem = (isOAS3) => {
    const getConfigs = () => ({
      fileUploadMediaTypes: [
        "application/octet-stream",
        "image/",
        "audio/",
        "video/",
      ],
    })
    const getSystem = () => ({
      getComponent: (c) => components[c],
      getConfigs,
      specSelectors: {
        isOAS3() {
          return isOAS3
        },
      },
      fn: {
        inferSchema,
        memoizedSampleFromSchema,
        memoizedCreateXMLExample,
        getJsonSampleSchema: makeGetJsonSampleSchema(getSystem),
        getYamlSampleSchema: makeGetYamlSampleSchema(getSystem),
        getXmlSampleSchema: makeGetXmlSampleSchema(getSystem),
        getSampleSchema: makeGetSampleSchema(getSystem),
        hasSchemaType: (schema, type) => {
          if (!schema) return false
          const schemaType =
            typeof schema?.get === "function" ? schema.get("type") : schema.type
          return schemaType === type
        },
        isFileUploadIntended: makeIsFileUploadIntended(getSystem),
      },
    })
    return getSystem()
  }

  it("does not render a synthetic example for application/octet-stream responses (OAS3)", function () {
    const props = {
      ...buildSystem(true),
      contentType: "application/octet-stream",
      className: "for-test",
      specPath: List(),
      response: fromJS({
        content: {
          "application/octet-stream": {
            schema: {
              type: "string",
              format: "binary",
            },
          },
        },
      }),
      code: "200",
    }

    const wrapper = shallow(<Response {...props} />)
    const renderedModelExample = wrapper.find(ModelExample)
    expect(renderedModelExample.length).toEqual(1)
    expect(renderedModelExample.props().example).toBeNull()
  })

  it("renders user-supplied example for application/octet-stream responses (OAS3)", function () {
    const props = {
      ...buildSystem(true),
      contentType: "application/octet-stream",
      className: "for-test",
      specPath: List(),
      response: fromJS({
        content: {
          "application/octet-stream": {
            schema: {
              type: "string",
              format: "binary",
            },
            example: "user-provided-example",
          },
        },
      }),
      code: "200",
    }

    const wrapper = shallow(<Response {...props} />)
    const renderedModelExample = wrapper.find(ModelExample)
    expect(renderedModelExample.length).toEqual(1)
    expect(renderedModelExample.props().example).not.toBeNull()
  })

  it("does not render a synthetic example for OAS 2.0 octet-stream responses", function () {
    const props = {
      ...buildSystem(false),
      contentType: "application/octet-stream",
      className: "for-test",
      specPath: List(),
      response: fromJS({
        schema: {
          type: "string",
          format: "binary",
        },
      }),
      code: "200",
    }

    const wrapper = shallow(<Response {...props} />)
    const renderedModelExample = wrapper.find(ModelExample)
    expect(renderedModelExample.length).toEqual(1)
    expect(renderedModelExample.props().example).toBeNull()
  })

  it("still renders a synthetic example for application/json responses", function () {
    const props = {
      ...buildSystem(true),
      contentType: "application/json",
      className: "for-test",
      specPath: List(),
      response: fromJS({
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                a: { type: "string" },
              },
            },
          },
        },
      }),
      code: "200",
    }

    const wrapper = shallow(<Response {...props} />)
    const renderedModelExample = wrapper.find(ModelExample)
    expect(renderedModelExample.length).toEqual(1)
    expect(renderedModelExample.props().example).not.toBeNull()
  })
})
