/**
 * @prettier
 */

import React from "react"
import { mount } from "enzyme"
import expect from "expect"
import VersionStamp from "core/components/version-stamp"
import OpenAPIVersion from "core/components/openapi-version"

describe("<VersionStamp/>", function () {
  it("should not render a <pre> element for the version label", function () {
    const wrapper = mount(<VersionStamp version="1.0.0" />)

    expect(wrapper.find("pre").length).toEqual(0)
  })

  it("should render the version inside an inline element with the .version class", function () {
    const wrapper = mount(<VersionStamp version="1.0.0" />)
    const versionEl = wrapper.find("small").find(".version")

    expect(versionEl.length).toEqual(1)
    expect(versionEl.text().trim()).toEqual("1.0.0")
  })
})

describe("<OpenAPIVersion/>", function () {
  it("should not render a <pre> element for the OAS version label", function () {
    const wrapper = mount(<OpenAPIVersion oasVersion="3.0.0" />)

    expect(wrapper.find("pre").length).toEqual(0)
  })

  it("should render the OAS version inside an inline element with the .version class", function () {
    const wrapper = mount(<OpenAPIVersion oasVersion="3.0.0" />)
    const versionEl = wrapper.find("small.version-stamp").find(".version")

    expect(versionEl.length).toEqual(1)
    expect(versionEl.text()).toEqual("OAS 3.0.0")
  })
})
