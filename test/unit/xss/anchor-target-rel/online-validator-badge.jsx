import React from "react"
import { mount } from "enzyme"
import OnlineValidatorBadge from "core/components/online-validator-badge"

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
      "https://validator.swagger.io/validator/debug?url=swagger.json"
    )
    expect(anchor.props().target).toEqual("_blank")
    expect(anchor.props().rel || "").toInclude("noopener")
    expect(anchor.props().rel || "").toInclude("noreferrer")
  })
})
