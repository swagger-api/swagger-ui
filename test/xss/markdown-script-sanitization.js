/* eslint-env mocha */
import React from "react"
import expect from "expect"
import { render } from "enzyme"
import Markdown from "components/providers/markdown"
import { Markdown as OAS3Markdown } from "corePlugins/oas3/wrap-components/markdown.js"

describe("Markdown Script Sanitization", function() {
  describe("Swagger 2.0", function() {
    it("sanitizes <script> elements", function() {
      const str = `script <script>alert(1)</script>`
      const el = render(<Markdown source={str} />)
      expect(el.html()).toEqual(`<div class="markdown"><p>script </p>\n</div>`)
    })

    it("sanitizes <img> elements", function() {
      const str = `<img src=x onerror="alert('img-in-description')">`
      const el = render(<Markdown source={str} />)
      expect(el.html()).toEqual(`<div class="markdown"><p><img src="x"></p>\n</div>`)
    })
  })

  describe("OAS 3", function() {
    it("sanitizes <script> elements", function() {
      const str = `script <script>alert(1)</script>`
      const el = render(<OAS3Markdown source={str} />)
      expect(el.html()).toEqual(`<div class="renderedMarkdown"><p>script </p></div>`)
    })

    it("sanitizes <img> elements", function() {
      const str = `<img src=x onerror="alert('img-in-description')">`
      const el = render(<OAS3Markdown source={str} />)
      expect(el.html()).toEqual(`<div class="renderedMarkdown"><p><img src="x"></p></div>`)
    })
  })
})
