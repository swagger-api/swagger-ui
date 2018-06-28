/* eslint-env mocha */
import React from "react"
import expect, { createSpy } from "expect"
import { shallow } from "enzyme"
import { fromJS, Map } from "immutable"
import Models from "components/models"
import ModelCollpase from "components/model-collapse"
import ModelComponent from "components/model-wrapper"

describe("<Models/>", function(){
  // Given
  let components = {
    Collapse: ModelCollpase,
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
