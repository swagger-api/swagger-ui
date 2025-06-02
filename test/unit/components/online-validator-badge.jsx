import React from "react"
import { mount } from "enzyme"
import OnlineValidatorBadge from "core/components/online-validator-badge"
import expect from "expect"

describe("<OnlineValidatorBadge/>", function () {
  it("should render a validator link and image correctly for the default validator", function () {
    // When
    const props = {
      getConfigs: () => ({}),
      getComponent: () => null,
      specSelectors: {
        url: () => "https://smartbear.com/swagger.json"
      }
    }
    const wrapper = mount(
     <OnlineValidatorBadge {...props} />
    )

    // Then
    expect(wrapper.find("a").props().href).toEqual(
      "https://validator.swagger.io/validator/debug?url=https%3A%2F%2Fsmartbear.com%2Fswagger.json"
    )
    expect(wrapper.find("ValidatorImage").length).toEqual(1)
  })

  it("should encode a definition URL correctly", function () {
    // When
    const props = {
      getConfigs: () => ({}),
      getComponent: () => null,
      specSelectors: {
        url: () => "http://google.com/swagger.json"
      }
    }
    const wrapper = mount(
      <OnlineValidatorBadge {...props} />
    )

    // Then
    expect(wrapper.find("a").props().href).toEqual(
      "https://validator.swagger.io/validator/debug?url=http%3A%2F%2Fgoogle.com%2Fswagger.json"
    )
    expect(wrapper.find("ValidatorImage").length).toEqual(1)
    expect(wrapper.find("ValidatorImage").props().src).toEqual(
      "https://validator.swagger.io/validator?url=http%3A%2F%2Fgoogle.com%2Fswagger.json"
    )
  })

  it("should resolve a definition URL against the browser's location", function () {
    // TODO: mock `window`
    // When

    const props = {
      getConfigs: () => ({}),
      getComponent: () => null,
      specSelectors: {
        url: () => "http://google.com/swagger.json"
      }
    }
    const wrapper = mount(
      <OnlineValidatorBadge {...props} />
    )

    // Then
    expect(wrapper.find("a").props().href).toEqual(
      "https://validator.swagger.io/validator/debug?url=http%3A%2F%2Fgoogle.com%2Fswagger.json"
    )
    expect(wrapper.find("ValidatorImage").length).toEqual(1)
    expect(wrapper.find("ValidatorImage").props().src).toEqual(
      "https://validator.swagger.io/validator?url=http%3A%2F%2Fgoogle.com%2Fswagger.json"
    )
  })
  // should resolve a definition URL against the browser's location
})
