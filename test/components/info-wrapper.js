
/* eslint-env mocha */
import React from "react"
import expect from "expect"
import { mount } from "enzyme"
import { fromJS } from "immutable"
import InfoWrapper from "components/info-wrapper"

describe("<InfoWrapper/>", function () {

  const components = {
    info: () => <span className="mocked-info"/>
  }
  const mockedProps = {
    specSelectors: {
      info () {},
      url () {},
      basePath () {},
      host () {},
      externalDocs () {}
    },
    getComponent: c => components[c]
  }

  it("renders Info inside InfoWrapper if info is provided", function () {

    // Given
    let props = {...mockedProps}
    props.specSelectors = {...mockedProps.specSelectors}
    props.specSelectors.info = function () {return fromJS(["info1", "info2"])}

    // When
    let wrapper = mount(<InfoWrapper {...props}/>)

    // Then
    const renderedInfo = wrapper.find("span.mocked-info")
    expect(renderedInfo.length).toEqual(1)
  })

  it("does not render Info inside InfoWrapper if no info is provided", function () {

    // Given
    let props = {...mockedProps}
    props.specSelectors = {...mockedProps.specSelectors}
    props.specSelectors.info = function () {return fromJS([])}

    // When
    let wrapper = mount(<InfoWrapper {...props}/>)

    // Then
    const renderedInfo = wrapper.find("span.mocked-info")
    expect(renderedInfo.length).toEqual(0)
  })

  it("does not render Info inside InfoWrapper if info is undefined", function () {

    // Given
    let props = {...mockedProps}

    // When
    let wrapper = mount(<InfoWrapper {...props}/>)

    // Then
    const renderedInfo = wrapper.find("span.mocked-info")
    expect(renderedInfo.length).toEqual(0)
  })
})
