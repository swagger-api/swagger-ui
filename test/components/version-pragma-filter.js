/* eslint-env mocha */
import React from "react"
import expect, { createSpy } from "expect"
import { shallow } from "enzyme"
import { fromJS, Map } from "immutable"
import VersionPragmaFilter from "components/version-pragma-filter"

describe("<VersionPragmaFilter/>", function(){
  it("renders children for a Swagger 2 definition", function(){
    // When
    let wrapper = shallow(
      <VersionPragmaFilter isSwagger2={true} isOAS3={false}>
        hello!
      </VersionPragmaFilter>
    )

    // Then
    expect(wrapper.find("div").length).toEqual(1)
    expect(wrapper.find("div").text()).toEqual("hello!")
  })
  it("renders children for an OpenAPI 3 definition", function(){
    // When
    let wrapper = shallow(
      <VersionPragmaFilter isSwagger2={false} isOAS3={true}>
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
      <VersionPragmaFilter bypass>
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
      <VersionPragmaFilter isSwagger2={true} isOAS3={true}>
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
      <VersionPragmaFilter isSwagger2={false} isOAS3={false}>
        hello!
      </VersionPragmaFilter>
    )

    // Then
    expect(wrapper.find("div.version-pragma__message--missing").length).toEqual(1)
    expect(wrapper.find("div.version-pragma__message--ambiguous").length).toEqual(0)
  })

})
