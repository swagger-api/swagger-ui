import React from "react"
import Immutable, { List } from "immutable"
import { Select, Input, TextArea } from "core/components/layout-utils"
import { mount, render } from "enzyme"
import { getSchemaObjectType } from "core/plugins/json-schema-5-samples/fn/index"
import { foldType } from "core/plugins/json-schema-2020-12-samples/fn/core/type"
import * as JsonSchemaComponents from "core/plugins/json-schema-5/components/json-schema-components"
import { makeIsFileUploadIntended } from "core/plugins/oas3/fn"

const components = {...JsonSchemaComponents, Select, Input, TextArea}

const getComponentStub = (name) => {
  if(components[name]) return components[name]

  return null
}

const getSystemStub = () => ({
  getConfigs: () => ({
    fileUploadMediaTypes: [],
  }),
  fn: {
    hasSchemaType: () => {},
    isFileUploadIntendedOAS30: () => {},
  },
})

describe("<JsonSchemaComponents.JsonSchemaForm/>", function(){
  describe("strings", function() {
    it("should render the correct options for a string enum parameter", function(){

      let props = {
        getComponent: getComponentStub,
        value: "",
        onChange: () => {},
        keyName: "",
        fn: {
          getSchemaObjectType,
          isFileUploadIntended: makeIsFileUploadIntended(getSystemStub)
        },
        schema: Immutable.fromJS({
          type: "string",
          enum: ["one", "two"]
        })
      }

      let wrapper = render(<JsonSchemaComponents.JsonSchemaForm {...props}/>)

      expect(wrapper.get(0).name).toEqual("select")
      expect(wrapper.find("option").length).toEqual(3)
      expect(wrapper.find("option").eq(0).text()).toEqual("--")
      expect(wrapper.find("option").eq(1).text()).toEqual("one")
      expect(wrapper.find("option").eq(2).text()).toEqual("two")
    })

    it("should render a string enum as disabled when JsonSchemaForm is disabled", function(){

      let props = {
        getComponent: getComponentStub,
        value: "",
        onChange: () => {},
        keyName: "",
        fn: {
          getSchemaObjectType,
          isFileUploadIntended: makeIsFileUploadIntended(getSystemStub)
        },
        schema: Immutable.fromJS({
          type: "string",
          enum: ["one", "two"]
        }),
        disabled: true
      }

      let wrapper = render(<JsonSchemaComponents.JsonSchemaForm {...props}/>)

      expect(wrapper.attr("disabled")).toEqual("disabled")
    })


    it("should render the correct options for a required string enum parameter", function(){

      let props = {
        getComponent: getComponentStub,
        value: "",
        onChange: () => {},
        keyName: "",
        fn: {
          getSchemaObjectType,
          isFileUploadIntended: makeIsFileUploadIntended(getSystemStub)
        },
        required: true,
        schema: Immutable.fromJS({
          type: "string",
          enum: ["one", "two"]
        })
      }

      let wrapper = render(<JsonSchemaComponents.JsonSchemaForm {...props}/>)

      expect(wrapper.get(0).name).toEqual("select")
      expect(wrapper.find("select option").length).toEqual(2)
      expect(wrapper.find("select option").eq(0).text()).toEqual("one")
      expect(wrapper.find("select option").eq(1).text()).toEqual("two")
    })
  })
  describe("booleans", function() {
    it("should render the correct options for a boolean parameter", function(){

      let props = {
        getComponent: getComponentStub,
        value: "",
        onChange: () => {},
        keyName: "",
        fn: {
          getSchemaObjectType,
          isFileUploadIntended: makeIsFileUploadIntended(getSystemStub)
        },
        schema: Immutable.fromJS({
          type: "boolean"
        })
      }

      let wrapper = render(<JsonSchemaComponents.JsonSchemaForm {...props}/>)

      expect(wrapper.get(0).name).toEqual("select")
      expect(wrapper.find("select option").length).toEqual(3)
      expect(wrapper.find("select option").eq(0).text()).toEqual("--")
      expect(wrapper.find("select option").eq(1).text()).toEqual("true")
      expect(wrapper.find("select option").eq(2).text()).toEqual("false")
    })


    it("should render the correct options for an enum boolean parameter", function(){

      let props = {
        getComponent: getComponentStub,
        value: "",
        onChange: () => {},
        keyName: "",
        fn: {
          getSchemaObjectType,
          isFileUploadIntended: makeIsFileUploadIntended(getSystemStub)
        },
        schema: Immutable.fromJS({
          type: "boolean",
          enum: ["true"]
        })
      }

      let wrapper = render(<JsonSchemaComponents.JsonSchemaForm {...props}/>)

      expect(wrapper.get(0).name).toEqual("select")
      expect(wrapper.find("select option").length).toEqual(2)
      expect(wrapper.find("select option").eq(0).text()).toEqual("--")
      expect(wrapper.find("select option").eq(1).text()).toEqual("true")
      expect(wrapper.find("select option:checked").first().text()).toEqual("--")
    })

    it("should render the correct options for a required boolean parameter", function(){

      let props = {
        getComponent: getComponentStub,
        value: "",
        onChange: () => {},
        keyName: "",
        fn: {
          getSchemaObjectType,
          isFileUploadIntended: makeIsFileUploadIntended(getSystemStub)
        },
        schema: Immutable.fromJS({
          type: "boolean",
          required: true
        })
      }

      let wrapper = render(<JsonSchemaComponents.JsonSchemaForm {...props}/>)

      expect(wrapper.get(0).name).toEqual("select")
      expect(wrapper.find("select option").length).toEqual(3)
      expect(wrapper.find("select option").eq(0).text()).toEqual("--")
      expect(wrapper.find("select option").eq(1).text()).toEqual("true")
      expect(wrapper.find("select option").eq(2).text()).toEqual("false")
      expect(wrapper.find("select option:checked").first().text()).toEqual("--")
    })

    it("should render the correct options for a required enum boolean parameter", function(){

      let props = {
        getComponent: getComponentStub,
        value: "",
        onChange: () => {},
        keyName: "",
        fn: {
          getSchemaObjectType,
          isFileUploadIntended: makeIsFileUploadIntended(getSystemStub)
        },
        required: true,
        schema: Immutable.fromJS({
          type: "boolean",
          enum: ["true"]
        })
      }

      let wrapper = render(<JsonSchemaComponents.JsonSchemaForm {...props}/>)

      expect(wrapper.get(0).name).toEqual("select")
      expect(wrapper.find("select option").length).toEqual(1)
      expect(wrapper.find("select option").eq(0).text()).toEqual("true")
      expect(wrapper.find("select option:checked").first().text()).toEqual("true")
    })
  })
  describe("objects", function() {
    it("should render the correct editor for an OAS3 object parameter", function(){
      let updateQueue = []

      let props = {
        getComponent: getComponentStub,
        value: `{\n  "id": "abc123"\n}`,
        onChange: (value) => {
          updateQueue.push({ value })
        },
        keyName: "",
        fn: {
          getSchemaObjectType,
          isFileUploadIntended: makeIsFileUploadIntended(getSystemStub)
        },
        errors: List(),
        schema: Immutable.fromJS({
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "abc123"
            }
          }
        })
      }

      let wrapper = mount(<JsonSchemaComponents.JsonSchemaForm {...props}/>)

      updateQueue.forEach(newProps => wrapper.setProps(newProps))

      expect(wrapper.find("textarea").length).toEqual(1)
      expect(wrapper.find("textarea").text()).toEqual(`{\n  "id": "abc123"\n}`)
    })
  })
  describe("nullable arrays (OpenAPI 3.1 type lists)", function() {
    // In OAS 3.1/3.2, `getSchemaObjectType` is `foldType`, which folds a type
    // list such as ["array", "null"] down to "array".
    const oas31Fn = {
      getSchemaObjectType: (schema) => foldType(schema?.toJS?.()?.type),
      getSchemaObjectTypeLabel: (schema) => foldType(schema?.toJS?.()?.type),
      isFileUploadIntended: makeIsFileUploadIntended(getSystemStub),
    }

    it("renders the array enum picker (Select) for a single 'array' type", function(){
      let props = {
        getComponent: getComponentStub,
        value: List(),
        onChange: () => {},
        keyName: "",
        fn: oas31Fn,
        errors: List(),
        schema: Immutable.fromJS({
          type: "array",
          items: {
            type: "string",
            enum: ["ACTIVE", "INACTIVE", "DELETED"]
          }
        })
      }

      let wrapper = mount(<JsonSchemaComponents.JsonSchemaForm {...props}/>)

      // The "array picker" widget is a multi-select dropdown of the enum values.
      expect(wrapper.find("select").length).toEqual(1)
      expect(wrapper.find("select").props().multiple).toEqual(true)
      const optionLabels = wrapper.find("select option").map((o) => o.text())
      expect(optionLabels).toEqual(expect.arrayContaining(["ACTIVE", "INACTIVE", "DELETED"]))
      expect(wrapper.find("textarea").length).toEqual(0)
    })

    it("renders the array enum picker for a nullable array type [\"array\", \"null\"] (#9056)", function(){
      let props = {
        getComponent: getComponentStub,
        value: List(),
        onChange: () => {},
        keyName: "",
        fn: oas31Fn,
        errors: List(),
        schema: Immutable.fromJS({
          // Idiomatic OpenAPI 3.1 way to express a nullable array.
          type: ["array", "null"],
          items: {
            type: "string",
            enum: ["ACTIVE", "INACTIVE", "DELETED"]
          }
        })
      }

      let wrapper = mount(<JsonSchemaComponents.JsonSchemaForm {...props}/>)

      // Regression for swagger-api/swagger-ui#9056: a nullable array must still
      // render the array enum picker, not the generic object/JSON textarea.
      expect(wrapper.find("select").length).toEqual(1)
      expect(wrapper.find("select").props().multiple).toEqual(true)
      const optionLabels = wrapper.find("select option").map((o) => o.text())
      expect(optionLabels).toEqual(expect.arrayContaining(["ACTIVE", "INACTIVE", "DELETED"]))
      expect(wrapper.find("textarea").length).toEqual(0)
    })

    it("renders the JSON editor for a nullable object type [\"object\", \"null\"]", function(){
      let props = {
        getComponent: getComponentStub,
        value: `{\n  "id": "abc123"\n}`,
        onChange: () => {},
        keyName: "",
        fn: oas31Fn,
        errors: List(),
        schema: Immutable.fromJS({
          type: ["object", "null"],
          properties: {
            id: { type: "string", example: "abc123" }
          }
        })
      }

      let wrapper = mount(<JsonSchemaComponents.JsonSchemaForm {...props}/>)

      // Nullable objects keep the existing JSON editor behavior.
      expect(wrapper.find("textarea").length).toEqual(1)
    })
  })

  describe("unknown types", function() {
    it("should render unknown types as strings", function(){

      let props = {
        getComponent: getComponentStub,
        value: "yo",
        onChange: () => {},
        keyName: "",
        fn: {
          getSchemaObjectType,
          isFileUploadIntended: makeIsFileUploadIntended(getSystemStub)
        },
        schema: Immutable.fromJS({
          type: "NotARealType"
        })
      }


      let wrapper = render(<JsonSchemaComponents.JsonSchemaForm {...props}/>)

      expect(wrapper.length).toEqual(1)
      expect(wrapper.get(0).name).toEqual("input")
      // expect(wrapper.find("select input").length).toEqual(1)
      // expect(wrapper.find("select option").first().text()).toEqual("true")
    })

    it("should render unknown types as strings when a format is passed", function(){

      let props = {
        getComponent: getComponentStub,
        value: "yo",
        onChange: () => {},
        keyName: "",
        fn: {
          getSchemaObjectType,
          isFileUploadIntended: makeIsFileUploadIntended(getSystemStub)
        },
        schema: Immutable.fromJS({
          type: "NotARealType",
          format: "NotARealFormat"
        })
      }


      let wrapper = render(<JsonSchemaComponents.JsonSchemaForm {...props}/>)

      expect(wrapper.length).toEqual(1)
      expect(wrapper.get(0).name).toEqual("input")
      // expect(wrapper.find("select input").length).toEqual(1)
      // expect(wrapper.find("select option").first().text()).toEqual("true")
    })
  })
})
