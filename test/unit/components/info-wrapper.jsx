import React from "react"
import { mount } from "enzyme"
import { fromJS } from "immutable"
import InfoContainer from "core/containers/info"

describe("<InfoContainer/>", function () {

  const components = {
    info: () => <span className="mocked-info"/>
  }
  const mockedProps = {
    specSelectors: {
      info () {},
      url () {},
      basePath () {},
      host () {},
      externalDocs () {},
    },
    oas3Selectors: {
      selectedServer () {},
    },
    getComponent: c => components[c]
  }

  it("renders Info inside InfoContainer if info is provided", function () {

    // Given
    let props = {...mockedProps}
    props.specSelectors = {...mockedProps.specSelectors}
    props.specSelectors.info = function () {return fromJS(["info1", "info2"])}

    // When
    let wrapper = mount(<InfoContainer {...props}/>)

    // Then
    const renderedInfo = wrapper.find("span.mocked-info")
    expect(renderedInfo.length).toEqual(1)
  })

  it("does not render Info inside InfoContainer if no info is provided", function () {

    // Given
    let props = {...mockedProps}
    props.specSelectors = {...mockedProps.specSelectors}
    props.specSelectors.info = function () {return fromJS([])}

    // When
    let wrapper = mount(<InfoContainer {...props}/>)

    // Then
    const renderedInfo = wrapper.find("span.mocked-info")
    expect(renderedInfo.length).toEqual(0)
  })

  it("does not render Info inside InfoContainer if info is undefined", function () {

    // Given
    let props = {...mockedProps}

    // When
    let wrapper = mount(<InfoContainer {...props}/>)

    // Then
    const renderedInfo = wrapper.find("span.mocked-info")
    expect(renderedInfo.length).toEqual(0)
  })
})
