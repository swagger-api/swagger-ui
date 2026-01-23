/**
 * @prettier
 */
import React from "react"
import { shallow } from "enzyme"
import SelfUri from "core/plugins/oas32/components/self-uri"

describe("OAS32 SelfUri component", () => {
  it("should render $self URI when present", () => {
    const props = {
      specSelectors: {
        selectSelfUriField: () => "https://api.example.com/spec",
      },
    }

    const wrapper = shallow(<SelfUri {...props} />)
    expect(wrapper.find("a").prop("href")).toBe("https://api.example.com/spec")
    expect(wrapper.text()).toContain("https://api.example.com/spec")
  })

  it("should not render when $self is not present", () => {
    const props = {
      specSelectors: {
        selectSelfUriField: () => null,
      },
    }

    const wrapper = shallow(<SelfUri {...props} />)
    expect(wrapper.type()).toBe(null)
  })

  it("should not render when $self is undefined", () => {
    const props = {
      specSelectors: {
        selectSelfUriField: () => undefined,
      },
    }

    const wrapper = shallow(<SelfUri {...props} />)
    expect(wrapper.type()).toBe(null)
  })

  it("should have target=_blank and rel=noopener noreferrer", () => {
    const props = {
      specSelectors: {
        selectSelfUriField: () => "https://api.example.com/spec",
      },
    }

    const wrapper = shallow(<SelfUri {...props} />)
    const link = wrapper.find("a")
    expect(link.prop("target")).toBe("_blank")
    expect(link.prop("rel")).toBe("noopener noreferrer")
  })
})
