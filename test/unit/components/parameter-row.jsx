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
  mergeJsonSchema,
} from "core/plugins/json-schema-5-samples/fn/index"
import makeGetSampleSchema from "core/plugins/json-schema-5-samples/fn/get-sample-schema"
import makeGetJsonSampleSchema from "core/plugins/json-schema-5-samples/fn/get-json-sample-schema"
import makeGetYamlSampleSchema from "core/plugins/json-schema-5-samples/fn/get-yaml-sample-schema"
import makeGetXmlSampleSchema from "core/plugins/json-schema-5-samples/fn/get-xml-sample-schema"
import { foldType } from "core/plugins/json-schema-2020-12-samples/fn/index"
import {
  makeGetType,
  isBooleanJSONSchema,
} from "core/plugins/json-schema-2020-12/fn.js"

describe("<ParameterRow/>", () => {
  const createProps = ({ param, isOAS3 }) => {
    const getSystem = () => ({
      getComponent: () => "div",
      specSelectors: {
        parameterWithMetaByIdentity: () => param,
        isOAS3: () => isOAS3,
        isSwagger2: () => !isOAS3,
      },
      fn: {
        memoizedSampleFromSchema,
        memoizedCreateXMLExample,
        getJsonSampleSchema: makeGetJsonSampleSchema(getSystem),
        getYamlSampleSchema: makeGetYamlSampleSchema(getSystem),
        getXmlSampleSchema: makeGetXmlSampleSchema(getSystem),
        getSampleSchema: makeGetSampleSchema(getSystem),
        mergeJsonSchema,
        jsonSchema202012: {
          foldType,
          getType: makeGetType(() => ({ isBooleanJSONSchema })),
        },
      },
      oas3Selectors: { activeExamplesMember: () => {} },
      getConfigs: () => ({}),
    })

    return {
      ...getSystem(),
      param,
      rawParam: param,
      pathMethod: [],
    }
  }

  it("Can render Swagger 2 parameter type with format", () => {
    const param = fromJS({
      name: "petUuid",
      in: "path",
      description: "UUID that identifies a pet",
      type: "string",
      format: "uuid",
    })

    const props = createProps({ param, isOAS3: false })
    const wrapper = render(<ParameterRow {...props} />)

    expect(wrapper.find(".parameter__type").length).toEqual(1)
    expect(wrapper.find(".parameter__type").text()).toEqual("string($uuid)")
  })

  it("Can render Swagger 2 parameter type without format", () => {
    const param = fromJS({
      name: "petId",
      in: "path",
      description: "ID that identifies a pet",
      type: "string",
    })

    const props = createProps({ param, isOAS3: false })
    const wrapper = render(<ParameterRow {...props} />)

    expect(wrapper.find(".parameter__type").length).toEqual(1)
    expect(wrapper.find(".parameter__type").text()).toEqual("string")
  })

  it("Can render Swagger 2 parameter type boolean without format", () => {
    const param = fromJS({
      name: "hasId",
      in: "path",
      description: "boolean value to indicate if the pet has an id",
      type: "boolean",
    })

    const props = createProps({ param, isOAS3: false })
    const wrapper = render(<ParameterRow {...props} />)

    expect(wrapper.find(".parameter__type").length).toEqual(1)
    expect(wrapper.find(".parameter__type").text()).toEqual("boolean")
  })

  it("Can render OAS3 parameter type with format", () => {
    const param = fromJS({
      name: "petUuid",
      in: "path",
      description: "UUID that identifies a pet",
      schema: {
        type: "string",
        format: "uuid",
      },
    })

    const props = createProps({ param, isOAS3: true })
    const wrapper = render(<ParameterRow {...props} />)

    expect(wrapper.find(".parameter__type").length).toEqual(1)
    expect(wrapper.find(".parameter__type").text()).toEqual("string($uuid)")
  })

  it("Can render OAS3 parameter type without format", () => {
    const param = fromJS({
      name: "petId",
      in: "path",
      description: "ID that identifies a pet",
      schema: {
        type: "string",
      },
    })

    const props = createProps({ param, isOAS3: true })
    const wrapper = render(<ParameterRow {...props} />)

    expect(wrapper.find(".parameter__type").length).toEqual(1)
    expect(wrapper.find(".parameter__type").text()).toEqual("string")
  })

  it("Can render OAS3 parameter type boolean without format", () => {
    const param = fromJS({
      name: "hasId",
      in: "path",
      description: "boolean value to indicate if the pet has an id",
      schema: {
        type: "boolean",
      },
    })

    const props = createProps({ param, isOAS3: true })
    const wrapper = render(<ParameterRow {...props} />)

    expect(wrapper.find(".parameter__type").length).toEqual(1)
    expect(wrapper.find(".parameter__type").text()).toEqual("boolean")
  })
})

describe("bug #5573: zero default and example values", function () {
  it("should apply a Swagger 2.0 default value of zero", function () {
    const paramValue = fromJS({
      description: "a pet",
      type: "integer",
      default: 0,
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
      fn: {
        memoizedSampleFromSchema,
        memoizedCreateXMLExample,
        getJsonSampleSchema: makeGetJsonSampleSchema(getSystem),
        getYamlSampleSchema: makeGetYamlSampleSchema(getSystem),
        getXmlSampleSchema: makeGetXmlSampleSchema(getSystem),
        getSampleSchema: makeGetSampleSchema(getSystem),
        jsonSchema202012: {
          foldType,
          getType: makeGetType(() => ({ isBooleanJSONSchema })),
        },
      },
      getConfigs: () => {
        return {}
      },
    })
    const props = {
      ...getSystem(),
      onChange: jest.fn(),
      param: paramValue,
      rawParam: paramValue,
      onChangeConsumes: () => {},
      pathMethod: [],
      specPath: List([]),
    }

    render(<ParameterRow {...props} />)

    expect(props.onChange).toHaveBeenCalled()
    expect(props.onChange).toHaveBeenCalledWith(paramValue, "0", false)
  })
  it("should apply a Swagger 2.0 example value of zero", function () {
    const paramValue = fromJS({
      description: "a pet",
      type: "integer",
      schema: {
        example: 0,
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
        jsonSchema202012: {
          foldType,
          getType: makeGetType(() => ({ isBooleanJSONSchema })),
        },
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
    expect(props.onChange).toHaveBeenCalledWith(paramValue, "0", false)
  })
  it("should apply an OpenAPI 3.0 default value of zero", function () {
    const paramValue = fromJS({
      description: "a pet",
      schema: {
        type: "integer",
        default: 0,
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
        mergeJsonSchema,
        jsonSchema202012: {
          foldType,
          getType: makeGetType(() => ({ isBooleanJSONSchema })),
        },
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
    expect(props.onChange).toHaveBeenCalledWith(paramValue, "0", false)
  })
  it("should apply an OpenAPI 3.0 example value of zero", function () {
    const paramValue = fromJS({
      description: "a pet",
      schema: {
        type: "integer",
        example: 0,
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
        mergeJsonSchema,
        jsonSchema202012: {
          foldType,
          getType: makeGetType(() => ({ isBooleanJSONSchema })),
        },
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
    expect(props.onChange).toHaveBeenCalledWith(paramValue, "0", false)
  })
})
