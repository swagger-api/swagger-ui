
/* eslint-env mocha */
import React from "react"
import expect, { createSpy } from "expect"
import { shallow } from "enzyme"
import { fromJS } from "immutable"
import Schemes from "components/schemes"

describe("<Schemes/>", function(){
  it("calls props.specActions.setScheme() when no operationScheme is selected", function(){

    let setSchemeSpy = createSpy()

    // Given
    let props = {
      specActions: {
        setScheme: setSchemeSpy
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

    // When the operationScheme is no longer in the list of options
    props.schemes = fromJS([
      "https"
    ])
    wrapper.setProps(props)

    // Then operationScheme should default to first scheme in options list
    expect(props.specActions.setScheme).toHaveBeenCalledWith("https", "/test", "get")
  })

  it.only("doesn't call props.specActions.setScheme() when schemes hasn't changed", function(){

    let setSchemeSpy = createSpy()

    // Given
    let props = {
      specActions: {
        setScheme: setSchemeSpy
      },
      schemes: fromJS([
        "http",
        "https"
      ]),
      operationScheme: "https"
    }

    // When
    let wrapper = shallow(<Schemes {...props}/>)

    // Should be called initially, to set the global state
    expect(setSchemeSpy.calls.length).toEqual(1)

    // After an update
    wrapper.instance().componentWillReceiveProps(props)

    // Should not be called again, since `operationScheme` is in schemes
    expect(setSchemeSpy.calls.length).toEqual(1)
  })
})
