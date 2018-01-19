import React from "react"
import expect from "expect"
import { shallow } from "enzyme"
import { fromJS, List } from "immutable"
import ObjectModel from "components/object-model"
import ModelExample from "components/model-example"
import Immutable from "immutable"
import Model from "components/model"
import ModelCollapse from "components/model-collapse"
import { inferSchema } from "corePlugins/samples/fn"

describe("<ObjectModel />", function() {
    const dummyComponent = () => null
    const components = {
      "JumpToPath" : dummyComponent,
      "Markdown" : dummyComponent,
      "Model" : Model,
      "ModelCollapse" : ModelCollapse
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
})
