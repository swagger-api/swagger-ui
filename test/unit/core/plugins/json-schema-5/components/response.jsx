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

describe("<Response />", function () {
  const dummyComponent = () => null
  const components = {
    headers: dummyComponent,
    highlightCode: dummyComponent,
    modelExample: ModelExample,
    Markdown: dummyComponent,
    operationLink: dummyComponent,
    contentType: dummyComponent,
  }
  const getSystem = () => ({
    getComponent: (c) => components[c],
    getConfigs: () => {
      return {}
    },
    specSelectors: {
      isOAS3() {
        return false
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
    },
  })
  const props = {
    ...getSystem(),
    contentType: "application/json",
    className: "for-test",
    specPath: List(),
    response: fromJS({
      schema: {
        type: "object",
        properties: {
          // Note reverse order: c, b, a
          c: {
            type: "integer",
          },
          b: {
            type: "boolean",
          },
          a: {
            type: "string",
          },
        },
      },
    }),
    code: "200",
  }

  it("renders the model-example schema properties in order", function () {
    const wrapper = shallow(<Response {...props} />)
    const renderedModelExample = wrapper.find(ModelExample)
    expect(renderedModelExample.length).toEqual(1)

    // Assert the schema's properties have maintained their order
    const modelExampleSchemaProperties = renderedModelExample
      .props()
      .schema.toJS().properties
    expect(Object.keys(modelExampleSchemaProperties)).toEqual(["c", "b", "a"])
  })

  it("should render without error when OAS3 response has empty examples map", function () {
    const oas3Components = {
      ...components,
      ExamplesSelect: dummyComponent,
      Example: dummyComponent,
    }
    const getOAS3System = () => ({
      getComponent: (c) => oas3Components[c],
      getConfigs: () => {
        return {}
      },
      specSelectors: {
        isOAS3() {
          return true
        },
      },
      fn: {
        inferSchema,
        memoizedSampleFromSchema,
        memoizedCreateXMLExample,
        getJsonSampleSchema: makeGetJsonSampleSchema(getOAS3System),
        getYamlSampleSchema: makeGetYamlSampleSchema(getOAS3System),
        getXmlSampleSchema: makeGetXmlSampleSchema(getOAS3System),
        getSampleSchema: makeGetSampleSchema(getOAS3System),
      },
    })
    const oas3Props = {
      ...getOAS3System(),
      contentType: "application/json",
      className: "for-test",
      specPath: List(),
      response: fromJS({
        description: "ok",
        content: {
          "application/json": {
            schema: {
              type: "object",
            },
            examples: {},
          },
        },
      }),
      code: "200",
      path: "/foo",
      method: "get",
      oas3Actions: {},
    }

    expect(() => {
      shallow(<Response {...oas3Props} />)
    }).not.toThrow()
  })
})
