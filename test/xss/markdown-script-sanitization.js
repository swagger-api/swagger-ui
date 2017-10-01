/* eslint-env mocha */
import React from "react"
import expect from "expect"
import { render } from "enzyme"
import Markdown from "components/providers/markdown"
import { Markdown as OAS3Markdown } from "corePlugins/oas3/wrap-components/markdown.js"

describe.only("Markdown Script Sanitization", function() {
  describe("Swagger 2.0", function() {
    it("sanitizes <script> elements", function() {
      const str = `script <script>alert(1)</script>`
      const el = render(<Markdown source={str} />)
      expect(el.html()).toEqual(`<div class="markdown"><p>script </p>\n</div>`)
    })
  })

  describe("OAS 3", function() {
    it("sanitizes <script> elements", function() {
      const str = `script <script>alert(1)</script>`
      const el = render(<OAS3Markdown source={str} />)
      expect(el.html()).toEqual(`<div class="renderedMarkdown"><div><p>script </p></div></div>`)
    })
  })
})
