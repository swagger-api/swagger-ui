import React from "react"
import { shallow } from "enzyme"
import { fromJS } from "immutable"
import PrimitiveModel from "core/components/primitive-model"
import ModelCollapse from "core/components/model-collapse"

describe("<PrimitiveModel/>", function () {
    const dummyComponent = () => null
    const components = {
      Markdown: dummyComponent,
      EnumModel: dummyComponent,
      Property: dummyComponent,
      "ModelCollapse" : ModelCollapse,
    }
    const props = {
      getComponent: c => components[c],
      getConfigs: () => ({
        showExtensions: false
      }),
      name: "Name from props",
      depth: 1,
      schema: fromJS({
        type: "string",
        title: "Custom model title"
      }),
      expandDepth: 1
    }

    it("renders the schema's title", function () {
      // When
      const wrapper = shallow(<PrimitiveModel {...props} />)
      const modelTitleEl = wrapper.find("ModelCollapse").prop("title").props.children.props.children

      expect(modelTitleEl).toEqual("Custom model title")
    })

    it("falls back to the passed-in `name` prop for the title", function () {
      // When
      props.schema = fromJS({
        type: "string"
      })
      const wrapper = shallow(<PrimitiveModel {...props} />)
      const modelTitleEl = wrapper.find("ModelCollapse").prop("title").props.children.props.children

      // Then
      expect(modelTitleEl).toEqual("Name from props")

    })

    it("renders a collapsible header", function(){
      const wrapper = shallow(<PrimitiveModel {...props}/>)
      const renderedModelCollapse = wrapper.find(ModelCollapse)
      expect(renderedModelCollapse.length).toEqual(1)
    })
})
