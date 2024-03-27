import React from "react"
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
