/**
 * @prettier
 */
import React from "react"
import { shallow } from "enzyme"
import VersionPragmaFilter from "core/plugins/oas32/components/version-pragma-filter"

describe("OAS32 VersionPragmaFilter", () => {
  it("should render children when version is valid (OAS 3.2)", () => {
    const wrapper = shallow(
      <VersionPragmaFilter
        bypass={false}
        isSwagger2={false}
        isOAS3={false}
        isOAS31={false}
        isOAS32={true}
      >
        <div className="test-child">Test Content</div>
      </VersionPragmaFilter>
    )

    expect(wrapper.find(".test-child")).toHaveLength(1)
    expect(wrapper.text()).toContain("Test Content")
  })

  it("should render children when bypass is true", () => {
    const wrapper = shallow(
      <VersionPragmaFilter
        bypass={true}
        isSwagger2={false}
        isOAS3={false}
        isOAS31={false}
        isOAS32={false}
      >
        <div className="test-child">Test Content</div>
      </VersionPragmaFilter>
    )

    expect(wrapper.find(".test-child")).toHaveLength(1)
  })

  it("should render error when version is ambiguous (Swagger2 and OAS32)", () => {
    const wrapper = shallow(
      <VersionPragmaFilter
        bypass={false}
        isSwagger2={true}
        isOAS3={false}
        isOAS31={false}
        isOAS32={true}
      >
        <div className="test-child">Test Content</div>
      </VersionPragmaFilter>
    )

    expect(wrapper.find(".version-pragma__message--ambiguous")).toHaveLength(1)
    expect(wrapper.text()).toContain("Unable to render this definition")
    expect(wrapper.find(".test-child")).toHaveLength(0)
  })

  it("should render error when version is missing", () => {
    const wrapper = shallow(
      <VersionPragmaFilter
        bypass={false}
        isSwagger2={false}
        isOAS3={false}
        isOAS31={false}
        isOAS32={false}
      >
        <div className="test-child">Test Content</div>
      </VersionPragmaFilter>
    )

    expect(wrapper.find(".version-pragma__message--missing")).toHaveLength(1)
    expect(wrapper.text()).toContain("Unable to render this definition")
    expect(wrapper.find(".test-child")).toHaveLength(0)
  })

  it("should render children when only OAS3 is present", () => {
    const wrapper = shallow(
      <VersionPragmaFilter
        bypass={false}
        isSwagger2={false}
        isOAS3={true}
        isOAS31={false}
        isOAS32={false}
      >
        <div className="test-child">Test Content</div>
      </VersionPragmaFilter>
    )

    // Should render children (valid single version)
    expect(wrapper.find(".test-child")).toHaveLength(1)
    expect(wrapper.text()).toContain("Test Content")
  })

  it("should render alsoShow when provided and version is invalid", () => {
    const alsoShowElement = <div className="also-show">Additional Info</div>

    const wrapper = shallow(
      <VersionPragmaFilter
        bypass={false}
        isSwagger2={false}
        isOAS3={false}
        isOAS31={false}
        isOAS32={false}
        alsoShow={alsoShowElement}
      >
        <div className="test-child">Test Content</div>
      </VersionPragmaFilter>
    )

    expect(wrapper.find(".also-show")).toHaveLength(1)
    expect(wrapper.text()).toContain("Additional Info")
  })
})
