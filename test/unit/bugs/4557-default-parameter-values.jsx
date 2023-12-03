/**
 * @prettier
 */
import React from "react"
import { List, fromJS } from "immutable"
import { render } from "enzyme"

import ParameterRow from "core/components/parameter-row"
import {
  memoizedSampleFromSchema,
  memoizedCreateXMLExample,
} from "core/plugins/json-schema-5-samples/fn/index"
import makeGetSampleSchema from "core/plugins/json-schema-5-samples/fn/get-sample-schema"
import makeGetJsonSampleSchema from "core/plugins/json-schema-5-samples/fn/get-json-sample-schema"
import makeGetYamlSampleSchema from "core/plugins/json-schema-5-samples/fn/get-yaml-sample-schema"
import makeGetXmlSampleSchema from "core/plugins/json-schema-5-samples/fn/get-xml-sample-schema"

describe("bug #4557: default parameter values", function () {
  it("should apply a Swagger 2.0 default value", function () {
    const paramValue = fromJS({
      description: "a pet",
      type: "string",
      default: "MyDefaultValue",
    })
    const getSystem = () => ({
      getComponent: () => "div",
      specSelectors: {
        security() {},
        parameterWithMetaByIdentity() {
          return paramValue
        },
        isOAS3() {
          return false
        },
        isSwagger2() {
          return true
        },
      },
      getConfigs: () => {
        return {}
      },
      fn: {
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
    expect(props.onChange).toHaveBeenCalledWith(
      paramValue,
      "MyDefaultValue",
      false
    )
  })
  it("should apply an OpenAPI 3.0 default value", function () {
    const paramValue = fromJS({
      description: "a pet",
      schema: {
        type: "string",
        default: "MyDefaultValue",
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
        getJsonSampleSchema: makeGetJsonSampleSchema(getSystem),
        getYamlSampleSchema: makeGetYamlSampleSchema(getSystem),
        getXmlSampleSchema: makeGetXmlSampleSchema(getSystem),
        getSampleSchema: makeGetSampleSchema(getSystem),
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
    expect(props.onChange).toHaveBeenCalledWith(
      paramValue,
      "MyDefaultValue",
      false
    )
  })
})
