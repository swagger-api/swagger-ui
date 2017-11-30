/* eslint-env mocha */
import React from "react"
import expect, { createSpy } from "expect"
import { Select } from "components/layout-utils"
import { render } from "enzyme"
import * as JsonSchemaComponents from "core/json-schema-components"
import { JsonSchemaForm } from "core/json-schema-components"

const components = {...JsonSchemaComponents, Select}

const getComponentStub = (name) => {
  return components[name] || (() => {
    console.error(`Couldn't find "${name}"`)
    return null
  })
}

describe("<JsonSchemaForm/>", function(){
  describe("strings", function() {
    it("should render the correct options for a string enum parameter", function(){

      let props = {
        getComponent: getComponentStub,
        value: "",
        onChange: () => {},
        keyName: "",
        fn: {},
        schema: {
          type: "string",
          enum: ["one", "two"]
        }
      }

      let wrapper = render(<JsonSchemaForm {...props}/>)

      expect(wrapper.find("select").length).toEqual(1)
      expect(wrapper.find("select option").length).toEqual(3)
      expect(wrapper.find("select option").eq(0).text()).toEqual("--")
      expect(wrapper.find("select option").eq(1).text()).toEqual("one")
      expect(wrapper.find("select option").eq(2).text()).toEqual("two")
    })

    it("should render the correct options for a required string enum parameter", function(){

      let props = {
        getComponent: getComponentStub,
        value: "",
        onChange: () => {},
        keyName: "",
        fn: {},
        required: true,
        schema: {
          type: "string",
          enum: ["one", "two"]
        }
      }

      let wrapper = render(<JsonSchemaForm {...props}/>)

      expect(wrapper.find("select").length).toEqual(1)
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
        fn: {},
        schema: {
          type: "boolean"
        }
      }

      let wrapper = render(<JsonSchemaForm {...props}/>)

      expect(wrapper.find("select").length).toEqual(1)
      expect(wrapper.find("select option").length).toEqual(3)
      expect(wrapper.find("select option").eq(0).text()).toEqual("--")
      expect(wrapper.find("select option").eq(1).text()).toEqual("true")
      expect(wrapper.find("select option").eq(2).text()).toEqual("false")
    })
    
    it("should render the correct options for a required enum boolean parameter", function(){

      let props = {
        getComponent: getComponentStub,
        value: "",
        onChange: () => {},
        keyName: "",
        fn: {},
        required: true,
        schema: {
          type: "boolean",
          enum: ["true"]
        }
      }

      let wrapper = render(<JsonSchemaForm {...props}/>)

      expect(wrapper.find("select").length).toEqual(1)
      expect(wrapper.find("select option").length).toEqual(1)
      expect(wrapper.find("select option").eq(1).text()).toEqual("true")
    })
  })
})
