import React from "react"
import { shallow } from "enzyme"
import { fromJS, Map } from "immutable"
import Models from "core/plugins/json-schema-5/components/models"
import ModelCollapse from "core/plugins/json-schema-5/components/model-collapse"
import ModelComponent from "core/plugins/json-schema-5/components/model-wrapper"

describe("<Models/>", function(){
  const dummyComponent = () => null
  // Given
  let components = {
    Collapse: ModelCollapse,
    ModelWrapper: ModelComponent,
    JumpToPath: dummyComponent,
  }
  let props = {
    getComponent: (c) => {
        return components[c]
    },
    specSelectors: {
      isOAS3: () => false,
      specJson: () => Map(),
      definitions: function() {
        return fromJS({
          def1: {},
          def2: {}
        })
      },
      specResolvedSubtree: () => {}
    },
    layoutSelectors: {
      isShown: jest.fn()
    },
    layoutActions: {},
    getConfigs: () => ({
      docExpansion: "list",
      defaultModelsExpandDepth: 0
    })
  }


  it("passes defaultModelsExpandDepth to ModelWrapper", function(){
    // When
    let wrapper = shallow(<Models {...props}/>)

    // Then should render tabs
    expect(wrapper.find("ModelCollapse").length).toEqual(1)
    expect(wrapper.find("ModelWrapper").length).toBeGreaterThan(0)
    wrapper.find("ModelComponent").forEach((modelWrapper) => {
      expect(modelWrapper.props().expandDepth).toBe(0)
    })
  })

})
