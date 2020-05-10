/* eslint-env mocha */
import React from "react"
import expect, { createSpy } from "expect"
import { shallow } from "enzyme"
import { fromJS, Map } from "immutable"
import ModelContainer from "components/model-container"
import ModelCollapse from "components/model-collapse"
import ModelComponent from "components/model-wrapper"

describe("<ModelContainer/>", function(){
  // Given
  let components = {
    ModelCollapse: ModelCollapse,
    ModelWrapper: ModelComponent
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
      isShown: createSpy()
    },
    layoutActions: {},
    specActions: {},
    getConfigs: () => ({
      defaultModelsExpandDepth: 0
    })
  }


  it("passes defaultModelsExpandDepth to ModelWrapper", function(){
    // When
    let wrapper = shallow(<ModelContainer {...props}/>)

    // Then should render tabs
    expect(wrapper.find("ModelCollapse").length).toEqual(1)
    expect(wrapper.find("ModelWrapper").length).toBeGreaterThan(0)
    expect(wrapper.find("ModelWrapper").props().expandDepth).toBe(0)
  })
})
