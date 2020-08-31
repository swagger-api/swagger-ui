/* eslint-env mocha */
import React from "react"
import expect from "expect"
import { configure, render } from "enzyme"
import Adapter from "enzyme-adapter-react-15"
import Markdown from "components/providers/markdown"
import { Markdown as OAS3Markdown } from "corePlugins/oas3/wrap-components/markdown.jsx"

configure({ adapter: new Adapter() })

describe("Markdown Link Anchor Safety", function () {
  describe("Swagger 2.0", function () {
    it("sanitizes Markdown links", function () {
      const str = `Hello, [here](http://google.com/) is my link`
      const wrapper = render(<Markdown source={str} />)

      const anchor = wrapper.find("a")

      expect(anchor.attr("href")).toEqual("http://google.com/")
      expect(anchor.attr("target")).toEqual("_blank")
      expect(anchor.attr("rel") || "").toInclude("noopener")
      expect(anchor.attr("rel") || "").toInclude("noreferrer")
    })

    it("sanitizes raw HTML links", function () {
      const str = `Hello, <a href="http://google.com/">here</a> is my link`
      const wrapper = render(<Markdown source={str} />)

      const anchor = wrapper.find("a")

      expect(anchor.attr("href")).toEqual("http://google.com/")
      expect(anchor.attr("rel") || "").toInclude("noopener")
      expect(anchor.attr("rel") || "").toInclude("noreferrer")
    })
  })

  describe("OAS 3", function () {
    it("sanitizes Markdown links", function () {
      const str = `Hello, [here](http://google.com/) is my link`
      const wrapper = render(<OAS3Markdown source={str} />)

      const anchor = wrapper.find("a")

      expect(anchor.attr("href")).toEqual("http://google.com/")
      expect(anchor.attr("target")).toEqual("_blank")
      expect(anchor.attr("rel") || "").toInclude("noopener")
      expect(anchor.attr("rel") || "").toInclude("noreferrer")
    })

    it("sanitizes raw HTML links", function () {
      const str = `Hello, <a href="http://google.com/">here</a> is my link`
      const wrapper = render(<OAS3Markdown source={str} />)

      const anchor = wrapper.find("a")

      expect(anchor.attr("href")).toEqual("http://google.com/")
      expect(anchor.attr("rel") || "").toInclude("noopener")
      expect(anchor.attr("rel") || "").toInclude("noreferrer")
    })
  })
})

function withMarkdownWrapper(str, { isOAS3 = false } = {}) {
  if(isOAS3) {
    return `<div class="renderedMarkdown"><p>${str}</p></div>`
  }

  return `<div class="markdown"><p>${str}</p>\n</div>`
}
