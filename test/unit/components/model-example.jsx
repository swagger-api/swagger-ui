/* eslint-env mocha */
import React from "react"
import expect, { createSpy } from "expect"
import { shallow } from "enzyme"
import ModelExample from "components/model-example"
import ModelComponent from "components/model-wrapper"

describe("<ModelExample/>", function(){
  let components, props
  
  let exampleSelectedTestInputs = [
    { defaultModelRendering: "model", isExecute: true },
    { defaultModelRendering: "example", isExecute: true },
    { defaultModelRendering: "example", isExecute: false },
    { defaultModelRendering: "othervalue", isExecute: true },
    { defaultModelRendering: "othervalue", isExecute: false }
  ]
  
  let modelSelectedTestInputs = [
    { defaultModelRendering: "model", isExecute: false }
  ]

  beforeEach(() => {
    components = {
      ModelWrapper: ModelComponent
    }
    
    props = {
      getComponent: (c) => {
          return components[c]
      },
      specSelectors: {
        isOAS3: () => false
      },
      schema: {},
      example: "{\"example\": \"value\"}",
      isExecute: false,
      getConfigs: () => ({
        defaultModelRendering: "model",
        defaultModelExpandDepth: 1
      })
    }
  })


  it("renders model and example tabs", function(){
    // When
    let wrapper = shallow(<ModelExample {...props}/>)

    // Then should render tabs
    expect(wrapper.find("div > ul.tab").length).toEqual(1)

    let tabs = wrapper.find("div > ul.tab").children()
    expect(tabs.length).toEqual(2)
    tabs.forEach((node) => {
      expect(node.length).toEqual(1)
      expect(node.name()).toEqual("li")
      expect(node.hasClass("tabitem")).toEqual(true)
    })
    expect(tabs.at(0).text()).toEqual("Example Value")
    expect(tabs.at(1).text()).toEqual("Model")
  })

  exampleSelectedTestInputs.forEach(function(testInputs) {
    it("example tab is selected if isExecute = " + testInputs.isExecute + " and defaultModelRendering = " + testInputs.defaultModelRendering, function(){
      // When
      props.isExecute = testInputs.isExecute
      props.getConfigs = () => ({
        defaultModelRendering: testInputs.defaultModelRendering,
        defaultModelExpandDepth: 1
      })
      let wrapper = shallow(<ModelExample {...props}/>)

      // Then
      let tabs = wrapper.find("div > ul.tab").children()

      let exampleTab = tabs.at(0)
      expect(exampleTab.hasClass("active")).toEqual(true)
      let modelTab = tabs.at(1)
      expect(modelTab.hasClass("active")).toEqual(false)

      expect(wrapper.find("div > div").length).toEqual(1)
      expect(wrapper.find("div > div").text()).toEqual(props.example)
    })
  })

  modelSelectedTestInputs.forEach(function(testInputs) {
    it("model tab is selected if isExecute = " + testInputs.isExecute + " and defaultModelRendering = " + testInputs.defaultModelRendering, function(){
      // When
      props.isExecute = testInputs.isExecute
      props.getConfigs = () => ({
        defaultModelRendering: testInputs.defaultModelRendering,
        defaultModelExpandDepth: 1
      })
      let wrapper = shallow(<ModelExample {...props}/>)

      // Then
      let tabs = wrapper.find("div > ul.tab").children()

      let exampleTab = tabs.at(0)
      expect(exampleTab.hasClass("active")).toEqual(false)
      let modelTab = tabs.at(1)
      expect(modelTab.hasClass("active")).toEqual(true)

      expect(wrapper.find("div > div").length).toEqual(1)
      expect(wrapper.find("div > div").find(ModelComponent).props().expandDepth).toBe(1)
    })
  })

  it("passes defaultModelExpandDepth to ModelComponent", function(){
      // When
      let expandDepth = 0
      props.isExecute = false
      props.getConfigs = () => ({
        defaultModelRendering: "model",
        defaultModelExpandDepth: expandDepth
      })
      let wrapper = shallow(<ModelExample {...props}/>)

      // Then
      expect(wrapper.find("div > div").find(ModelComponent).props().expandDepth).toBe(expandDepth)
  })

})
