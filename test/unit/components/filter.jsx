import React from "react"
import { mount } from "enzyme"
import FilterContainer from "core/containers/filter"
import { Col } from "core/components/layout-utils"

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

  it("exposes an accessible name on the filter input via aria-label", function(){

    // Given
    let props = {...mockedProps}
    props.layoutSelectors = {...mockedProps.specSelectors}
    props.layoutSelectors.currentFilter = function() {return true}

    // When
    let wrapper = mount(<FilterContainer {...props}/>)

    // Then
    const input = wrapper.find("input.operation-filter-input")
    expect(input.length).toEqual(1)
    expect(input.prop("aria-label")).toEqual("Filter by tag")
  })
})
