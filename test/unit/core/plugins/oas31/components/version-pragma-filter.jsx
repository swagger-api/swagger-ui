import React from "react"
import { shallow } from "enzyme"
import VersionPragmaFilter from "core/plugins/oas31/components/version-pragma-filter"

describe("<VersionPragmaFilter/>", function(){
  it("renders children for a Swagger 2 definition", function(){
    // When
    let wrapper = shallow(
      <VersionPragmaFilter isSwagger2={true} isOAS3={false} isOAS31={false}>
        hello!
      </VersionPragmaFilter>
    )

    // Then
    expect(wrapper.find("div").length).toEqual(1)
    expect(wrapper.find("div").text()).toEqual("hello!")
  })

  it("renders children for an OpenAPI 3.0.x definition", function(){
    // When
    let wrapper = shallow(
      <VersionPragmaFilter isSwagger2={false} isOAS3={true} isOAS31={false}>
        hello!
      </VersionPragmaFilter>
    )

    // Then
    expect(wrapper.find("div").length).toEqual(1)
    expect(wrapper.find("div").text()).toEqual("hello!")
  })

  it("renders children for an OpenAPI 3.1.0 definition", function(){
    // When
    let wrapper = shallow(
      <VersionPragmaFilter isSwagger2={false} isOAS3={false} isOAS31={true}>
        hello!
      </VersionPragmaFilter>
    )

    // Then
    expect(wrapper.find("div").length).toEqual(1)
    expect(wrapper.find("div").text()).toEqual("hello!")
  })

  it("renders children when a bypass prop is set", function(){
    // When
    let wrapper = shallow(
      <VersionPragmaFilter bypass isSwagger2={false} isOAS3={false} isOAS31={false}>
        hello!
      </VersionPragmaFilter>
    )

    // Then
    expect(wrapper.find("div").length).toEqual(1)
    expect(wrapper.find("div").text()).toEqual("hello!")
  })

  it("renders the correct message for an ambiguous-version definition", function(){
    // When
    let wrapper = shallow(
      <VersionPragmaFilter isSwagger2={true} isOAS3={true} isOAS31={true}>
        hello!
      </VersionPragmaFilter>
    )

    // Then
    expect(wrapper.find("div.version-pragma__message--ambiguous").length).toEqual(1)
    expect(wrapper.find("div.version-pragma__message--missing").length).toEqual(0)
  })

  it("renders the correct message for a missing-version definition", function(){
    // When
    let wrapper = shallow(
      <VersionPragmaFilter isSwagger2={false} isOAS3={false} isOAS31={false}>
        hello!
      </VersionPragmaFilter>
    )

    // Then
    expect(wrapper.find("div.version-pragma__message--missing").length).toEqual(1)
    expect(wrapper.find("div.version-pragma__message--ambiguous").length).toEqual(0)
  })

})
