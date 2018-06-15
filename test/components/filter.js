
/* eslint-env mocha */
import React from "react"
import expect from "expect"
import { mount } from "enzyme"
import FilterContainer from "containers/filter"
import { Col } from "components/layout-utils"

describe("<FilterContainer/>", function(){

  const mockedProps = {
    specSelectors: {
      loadingStatus() {}
    },
    layoutSelectors: {
      currentFilter() {}
    },
    getComponent: () => {return Col}
  }

  it("renders FilterContainer if filter is provided", function(){

    // Given
    let props = {...mockedProps}
    props.layoutSelectors = {...mockedProps.specSelectors}
    props.layoutSelectors.currentFilter = function() {return true}

    // When
    let wrapper = mount(<FilterContainer {...props}/>)

    // Then
    const renderedColInsideFilter = wrapper.find(Col)
    expect(renderedColInsideFilter.length).toEqual(1)
  })

  it("does not render FilterContainer if filter is null", function(){

    // Given
    let props = {...mockedProps}
    props.layoutSelectors = {...mockedProps.specSelectors}
    props.layoutSelectors.currentFilter = function() {return null}

    // When
    let wrapper = mount(<FilterContainer {...props}/>)

    // Then
    const renderedColInsideFilter = wrapper.find(Col)
    expect(renderedColInsideFilter.length).toEqual(0)
  })

  it("does not render FilterContainer if filter is false", function(){

    // Given
    let props = {...mockedProps}
    props.layoutSelectors = {...mockedProps.specSelectors}
    props.layoutSelectors.currentFilter = function() {return false}

    // When
    let wrapper = mount(<FilterContainer {...props}/>)

    // Then
    const renderedColInsideFilter = wrapper.find(Col)
    expect(renderedColInsideFilter.length).toEqual(0)
  })
})
