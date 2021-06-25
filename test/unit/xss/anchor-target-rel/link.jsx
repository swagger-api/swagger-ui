import React from "react"
import { render } from "enzyme"
import { Link } from "components/layout-utils"

describe("<Link/> Anchor Target Safety", function () {
  const dummyComponent = () => null
  const components = {
    Link
  }
  const baseProps = {
    getComponent: c => components[c] || dummyComponent
  }

  it("renders regular links with `noreferrer` and `noopener`", function () {
    const props = {
      ...baseProps,
      href: "http://google.com/"
    }
    let wrapper = render(<Link {...props} />)

    expect(wrapper.attr("href")).toEqual("http://google.com/")
    expect(wrapper.attr("rel") || "").toMatch("noopener")
    expect(wrapper.attr("rel") || "").toMatch("noreferrer")
  })

  it("enforces `noreferrer` and `noopener` on target=_blank links", function () {
    const props = {
      ...baseProps,
      href: "http://google.com/",
      target: "_blank"
    }
    let wrapper = render(<Link {...props} />)

    expect(wrapper.attr("href")).toEqual("http://google.com/")
    expect(wrapper.attr("target")).toEqual("_blank")
    expect(wrapper.attr("rel") || "").toMatch("noopener")
    expect(wrapper.attr("rel") || "").toMatch("noreferrer")
  })
})
