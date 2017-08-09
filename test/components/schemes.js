
/* eslint-env mocha */
import React from "react"
import expect, { createSpy } from "expect"
import { shallow } from "enzyme"
import { fromJS } from "immutable"
import Schemes from "components/schemes"

describe("<Schemes/>", function(){
  it("calls props.specActions.setScheme() when no operationScheme is selected", function(){

    // Given
    let props = {
      specActions: {
        setScheme: createSpy()
      },
      schemes: fromJS([
        "http",
        "https"
      ]),
      operationScheme: undefined,
      path: "/test",
      method: "get"
    }
    
    // When
    let wrapper = shallow(<Schemes {...props}/>)

    // Then operationScheme should default to first scheme in options list
    expect(props.specActions.setScheme).toHaveBeenCalledWith("http", "/test" , "get")
    
    // Call onChange, mimic selecting from dropdown
    wrapper.props().children[1].props.onChange({target: {value: "https"}})

    // Then operationScheme should default to first scheme in options list
    expect(props.specActions.setScheme).toHaveBeenCalledWith("https", "/test", "get")
  })
})
