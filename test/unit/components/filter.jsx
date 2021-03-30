import React from "react"
import { mount } from "enzyme"
import FilterContainer from "containers/filter"
import { Col } from "components/layout-utils"

describe("<FilterContainer/>", function(){

  const featureMock = (filterEnabled) => ({
    featuresSelectors: {
      isFeatureEnabled: (key) => {
        const dict = {
          filter: filterEnabled
        }
        return dict[key] === true
      }
    }
  })
  const mockedProps = {
    specSelectors: {
      loadingStatus() {}
    },
    layoutSelectors: {
      currentFilter() {}
    },
    getComponent: () => {return Col}
  }

  it("renders FilterContainer if filter is enabled", function(){

    // Given
    let props = {...mockedProps, ...featureMock(true)}
    props.layoutSelectors = {...mockedProps.specSelectors}
    props.layoutSelectors.currentFilter = function() {return true}

    // When
    let wrapper = mount(<FilterContainer {...props}/>)

    // Then
    const renderedColInsideFilter = wrapper.find(Col)
    expect(renderedColInsideFilter.length).toEqual(1)
  })

  it("does not render FilterContainer if feature filter is disabled", function(){

    // Given
    let props = {...mockedProps, ...featureMock(false)}
    props.layoutSelectors = {...mockedProps.specSelectors}
    props.layoutSelectors.currentFilter = function() {return "any"}

    // When
    let wrapper = mount(<FilterContainer {...props}/>)

    // Then
    const renderedColInsideFilter = wrapper.find(Col)
    expect(renderedColInsideFilter.length).toEqual(0)
  })
})
