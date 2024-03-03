import React from "react"
import { shallow } from "enzyme"
import { List } from "immutable"
import ObjectModel from "core/components/object-model"
// import ModelExample from "core/components/model-example"
import Immutable from "immutable"
import Model from "core/components/model"
import ModelCollapse from "core/components/model-collapse"
import Property from "core/components/property"
// import { inferSchema } from "core/plugins/samples/fn"

describe("<ObjectModel />", function() {
    const dummyComponent = () => null
    const components = {
      "JumpToPath" : dummyComponent,
      "Markdown" : dummyComponent,
      "Model" : Model,
      "ModelCollapse" : ModelCollapse,
      "Property" : Property
    }
    const props = {
      getComponent: c => components[c],
      getConfigs: () => {
        return {
          showExtensions: true
        }
      },
      isRef : false,
      specPath: List(),
      schema: Immutable.fromJS(
        {
          "properties": {
            // Note reverse order: c, b, a
            c: {
              type: "integer",
              name: "c"
            },
            b: {
              type: "boolean",
              name: "b"
            },
            a: {
              type: "string",
              name: "a"
            }
          }
        }
      ),
      specSelectors: {
        isOAS3(){
          return false
        }
      },
      className: "for-test"
    }
    const propsNullable = {
      ...props,
      schema: props.schema.set("nullable", true)
    }
    const propsMinMaxProperties = {
      ...props,
      schema: props.schema.set("minProperties", 1).set("maxProperties", 5)
    }

    it("renders a collapsible header", function(){
      const wrapper = shallow(<ObjectModel {...props}/>)
      const renderedModelCollapse = wrapper.find(ModelCollapse)
      expect(renderedModelCollapse.length).toEqual(1)
    })

    it("renders the object properties in order", function() {
        const wrapper = shallow(<ObjectModel {...props}/>)
        const renderedModel = wrapper.find(Model)
        expect(renderedModel.length).toEqual(3)
        expect(renderedModel.get(0).props.schema.get("name")).toEqual("c")
        expect(renderedModel.get(1).props.schema.get("name")).toEqual("b")
        expect(renderedModel.get(2).props.schema.get("name")).toEqual("a")
    })

    it("doesn't render `nullable` for model when it absent", function() {
      const wrapper = shallow(<ObjectModel {...props}/>)
      const renderProperties = wrapper.find(Property)
      expect(renderProperties.length).toEqual(0)
    })

    it("renders `nullable` for model", function() {
      const wrapper = shallow(<ObjectModel {...propsNullable}/>)
      const renderProperties = wrapper.find(Property)
      expect(renderProperties.length).toEqual(1)
      expect(renderProperties.get(0).props.propKey).toEqual("nullable")
      expect(renderProperties.get(0).props.propVal).toEqual(true)
    })

    it("doesn't render `minProperties` and `maxProperties` if they are absent", function() {
      const wrapper = shallow(<ObjectModel {...props}/>)
      const renderProperties = wrapper.find(Property)
      expect(renderProperties.length).toEqual(0)
    })

    it("renders `minProperties` and `maxProperties` if they are defined", function() {
      const wrapper = shallow(<ObjectModel {...propsMinMaxProperties}/>)
      const renderProperties = wrapper.find(Property)
      expect(renderProperties.length).toEqual(2)
      expect(renderProperties.get(0).props.propKey).toEqual("minProperties")
      expect(renderProperties.get(0).props.propVal).toEqual(1)
      expect(renderProperties.get(1).props.propKey).toEqual("maxProperties")
      expect(renderProperties.get(1).props.propVal).toEqual(5)
    })
})
