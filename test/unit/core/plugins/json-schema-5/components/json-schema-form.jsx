import React from "react"
import Immutable, { List } from "immutable"
import { Select, Input, TextArea } from "core/components/layout-utils"
import { mount, render } from "enzyme"
import * as JsonSchemaComponents from "core/plugins/json-schema-5/components/json-schema-components"
import { foldType } from "core/plugins/json-schema-2020-12-samples/fn/index"
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
          jsonSchema202012: {
            foldType,
          },
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
          jsonSchema202012: {
            foldType,
          },
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
          jsonSchema202012: {
            foldType,
          },
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
          jsonSchema202012: {
            foldType,
          },
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
          jsonSchema202012: {
            foldType,
          },
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
          jsonSchema202012: {
            foldType,
          },
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
          jsonSchema202012: {
            foldType,
          },
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
          jsonSchema202012: {
            foldType,
          },
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
  describe("unknown types", function() {
    it("should render unknown types as strings", function(){

      let props = {
        getComponent: getComponentStub,
        value: "yo",
        onChange: () => {},
        keyName: "",
        fn: {
          jsonSchema202012: {
            foldType,
          },
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
          jsonSchema202012: {
            foldType,
          },
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
