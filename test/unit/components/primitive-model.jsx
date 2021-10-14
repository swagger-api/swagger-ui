import React from "react"
import { shallow } from "enzyme"
import { fromJS } from "immutable"
import PrimitiveModel from "components/primitive-model"
import ModelCollapse from "components/model-collapse"

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
      })
    }

    it("renders a collapsible header", function(){
      const wrapper = shallow(<PrimitiveModel {...props}/>)
      const renderedModelCollapse = wrapper.find(ModelCollapse)
      expect(renderedModelCollapse.length).toEqual(1)
    })
})
