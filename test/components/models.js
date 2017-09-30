/* eslint-env mocha */
import React from "react"
import expect, { createSpy } from "expect"
import { shallow } from "enzyme"
import { fromJS } from "immutable"
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
      definitions: function() {
        return fromJS({
          def1: {},
          def2: {}
        })
      }
    },
    layoutSelectors: {
      isShown: createSpy()
    },
    layoutActions: {},
    getConfigs: () => ({
      docExpansion: "list",
      defaultModelExpandDepth: 0
    })
  }


  it("passes defaultModelExpandDepth to ModelWrapper", function(){
    // When
    let wrapper = shallow(<Models {...props}/>)

    // Then should render tabs
    expect(wrapper.find("ModelCollapse").length).toEqual(1)
    expect(wrapper.find("ModelComponent").length).toBeGreaterThan(0)
    wrapper.find("ModelComponent").forEach((modelWrapper) => {
      expect(modelWrapper.props().expandDepth).toBe(0)
    })
  })

})
