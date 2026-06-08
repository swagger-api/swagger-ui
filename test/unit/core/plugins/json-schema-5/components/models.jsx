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
    specActions: {
      requestResolvedSubtree: jest.fn()
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
    layoutActions: {
      show: jest.fn(),
      readyToScroll: jest.fn()
    },
    getConfigs: () => ({
      docExpansion: "list",
      defaultModelsExpandDepth: 0,
      resolveSubtreeOnExpand: false
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

  it("does not resolve model subtree on expand when disabled", function() {
    const localProps = {
      ...props,
      specActions: {
        requestResolvedSubtree: jest.fn()
      },
      layoutActions: {
        show: jest.fn(),
        readyToScroll: jest.fn()
      },
      getConfigs: () => ({
        docExpansion: "list",
        defaultModelsExpandDepth: 0,
        resolveSubtreeOnExpand: false
      })
    }

    const wrapper = shallow(<Models {...localProps}/>)
    wrapper.instance().handleToggle("def1", true)

    expect(localProps.layoutActions.show).toHaveBeenCalledWith(["definitions", "def1"], true)
    expect(localProps.specActions.requestResolvedSubtree).not.toHaveBeenCalled()
  })

  it("resolves model subtree on expand when enabled", function() {
    const localProps = {
      ...props,
      specActions: {
        requestResolvedSubtree: jest.fn()
      },
      layoutActions: {
        show: jest.fn(),
        readyToScroll: jest.fn()
      },
      getConfigs: () => ({
        docExpansion: "list",
        defaultModelsExpandDepth: 0,
        resolveSubtreeOnExpand: true
      })
    }

    const wrapper = shallow(<Models {...localProps}/>)
    wrapper.instance().handleToggle("def1", true)

    expect(localProps.specActions.requestResolvedSubtree).toHaveBeenCalledWith(["definitions", "def1"])
  })

})
