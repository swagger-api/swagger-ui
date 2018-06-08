
/* eslint-env mocha */
import React from "react"
import expect from "expect"
import { mount } from "enzyme"
import Filter from "components/filter"
import { Col } from "components/layout-utils"

describe("<Filter/>", function(){

  const mockedProps = {
    specSelectors: {
      loadingStatus() {}
    },
    layoutSelectors: {
      currentFilter() {}
    },
    getComponent: () => {return Col}
  }

  it("renders Filter if filter is provided", function(){

    // Given
    let props = {...mockedProps}
    props.layoutSelectors = {...mockedProps.specSelectors}
    props.layoutSelectors.currentFilter = function() {return true}

    // When
    let wrapper = mount(<Filter {...props}/>)

    // Then
    const renderedColInsideFilter = wrapper.find(Col)
    expect(renderedColInsideFilter.length).toEqual(1)
  })

  it("does not render Filter if filter is null", function(){

    // Given
    let props = {...mockedProps}
    props.layoutSelectors = {...mockedProps.specSelectors}
    props.layoutSelectors.currentFilter = function() {return null}

    // When
    let wrapper = mount(<Filter {...props}/>)

    // Then
    const renderedColInsideFilter = wrapper.find(Col)
    expect(renderedColInsideFilter.length).toEqual(0)
  })

  it("does not render Filter if filter is false", function(){

    // Given
    let props = {...mockedProps}
    props.layoutSelectors = {...mockedProps.specSelectors}
    props.layoutSelectors.currentFilter = function() {return false}

    // When
    let wrapper = mount(<Filter {...props}/>)

    // Then
    const renderedColInsideFilter = wrapper.find(Col)
    expect(renderedColInsideFilter.length).toEqual(0)
  })
})
