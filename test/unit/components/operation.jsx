import React from "react"
import { fromJS } from "immutable"
import { shallow } from "enzyme"
import Operation from "core/components/operation"

describe("<Operation/>", function(){
  it.skip("blanket tests", function(){

    let props = {
      operation: {get: ()=>{}},
      getComponent: ()=> "div",
      specSelectors: { security(){} },
      path: "/one",
      method: "get",
      shown: true,
      showOpId: "",
      showOpIdPrefix: "",
      toggleCollapse: jest.fn()
    }

    let wrapper = shallow(<Operation {...props}/>)

    expect(wrapper.find(".opblock").length).toEqual(1)
    expect(wrapper.find(".opblock-summary-method").text()).toEqual("GET")
    expect(wrapper.find(".opblock-summary-path").text().trim()).toEqual("/one")
    expect(wrapper.find("[isOpened]").prop("isOpened")).toEqual(true)

    wrapper.find(".opblock-summary").simulate("click")
    expect(props.toggleCollapse).toHaveBeenCalled()
  })
})


describe("operation method styling", () => {
  it.each([
    ["get", "opblock-get"],
    ["query", "opblock-query"],
    ["LIST", "opblock-custom"],
    ["X-Search", "opblock-custom"],
    ["X!Search", "opblock-custom"],
  ])("renders %s without changing its operation method", (method, className) => {
    const operation = fromJS({
      method,
      path: "/items",
      tag: "Items",
      operationId: "items",
      op: { responses: {} },
    })
    const wrapper = shallow(<Operation
      operation={operation}
      getComponent={() => "div"}
      getConfigs={() => ({})}
      specSelectors={{
        operationScheme: () => null,
        validationErrors: () => null,
        producesOptionsFor: () => null,
        currentProducesFor: () => null,
      }}
      oas3Selectors={{}}
    />)
    expect(wrapper.hasClass(className)).toBe(true)
    expect(wrapper.childAt(0).prop("operationProps").get("method")).toBe(method)
  })
})
