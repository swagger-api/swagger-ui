/* eslint-env mocha */
import React from "react"
import expect from "expect"
import { configure, render } from "enzyme"
import Adapter from "enzyme-adapter-react-15"
import { fromJS } from "immutable"
import { Link } from "components/layout-utils"

configure({ adapter: new Adapter() })

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
    const anchor = wrapper.find("a")

    expect(anchor.attr("href")).toEqual("http://google.com/")
    expect(anchor.attr("rel") || "").toInclude("noopener")
    expect(anchor.attr("rel") || "").toInclude("noreferrer")
  })

  it("enforces `noreferrer` and `noopener` on target=_blank links", function () {
    const props = {
      ...baseProps,
      href: "http://google.com/",
      target: "_blank"
    }
    let wrapper = render(<Link {...props} />)
    const anchor = wrapper.find("a")

    expect(anchor.attr("href")).toEqual("http://google.com/")
    expect(anchor.attr("target")).toEqual("_blank")
    expect(anchor.attr("rel") || "").toInclude("noopener")
    expect(anchor.attr("rel") || "").toInclude("noreferrer")
  })
})
