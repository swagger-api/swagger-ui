/* eslint-env mocha */
import React from "react"
import expect, { createSpy } from "expect"
import { mount } from "enzyme"
import { fromJS, Map } from "immutable"
import OnlineValidatorBadge from "components/online-validator-badge"

describe("<OnlineValidatorBadge/> Anchor Target Safety", function () {
  it("should render a validator link with safe `rel` attributes", function () {
    // When
    const props = {
      getConfigs: () => ({}),
      getComponent: () => null,
      specSelectors: {
        url: () => "swagger.json"
      }
    }
    const wrapper = mount(
     <OnlineValidatorBadge {...props} />
    )

    const anchor = wrapper.find("a")

    // Then
    expect(anchor.props().href).toEqual(
      "https://online.swagger.io/validator/debug?url=swagger.json"
    )
    expect(anchor.props().target).toEqual("_blank")
    expect(anchor.props().rel || "").toInclude("noopener")
    expect(anchor.props().rel || "").toInclude("noreferrer")
  })
})
