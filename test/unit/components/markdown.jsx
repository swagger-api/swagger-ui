import React from "react"
import { render } from "enzyme"
import Markdown from "components/providers/markdown"
import { Markdown as OAS3Markdown } from "corePlugins/oas3/wrap-components/markdown.jsx"

describe("Markdown component", function () {
  describe("Swagger 2.0", function () {
    it("allows elements with class, style and data-* attribs", function () {
      const getConfigs = () => ({ useUnsafeMarkdown: true })
      const str = `<span class="method" style="border-width: 1px" data-attr="value">ONE</span>`
      const el = render(<Markdown source={str} getConfigs={getConfigs} />)
      expect(el.prop("outerHTML")).toEqual(`<div class="markdown"><p><span data-attr="value" style="border-width: 1px" class="method">ONE</span></p>\n</div>`)
    })

    it("strips class, style and data-* attribs from elements", function () {
      const getConfigs = () => ({ useUnsafeMarkdown: false })
      const str = `<span class="method" style="border-width: 1px" data-attr="value">ONE</span>`
      const el = render(<Markdown source={str} getConfigs={getConfigs} />)
      expect(el.prop("outerHTML")).toEqual(`<div class="markdown"><p><span>ONE</span></p>\n</div>`)
    })

    it("allows td elements with colspan attrib", function () {
      const str = `<table><tr><td>ABC</td></tr></table>`
      const el = render(<Markdown source={str} />)
      expect(el.prop("outerHTML")).toEqual(`<div class="markdown"><table><tbody><tr><td>ABC</td></tr></tbody></table></div>`)
    })

    it("allows image elements", function () {
      const str = `![Image alt text](http://image.source "Image title")`
      const el = render(<Markdown source={str} />)
      expect(el.prop("outerHTML")).toEqual(`<div class="markdown"><p><img title="Image title" alt="Image alt text" src="http://image.source"></p>\n</div>`)
    })

    it("allows image elements with https scheme", function () {
      const str = `![Image alt text](https://image.source "Image title")`
      const el = render(<Markdown source={str} />)
      expect(el.prop("outerHTML")).toEqual(`<div class="markdown"><p><img title="Image title" alt="Image alt text" src="https://image.source"></p>\n</div>`)
    })

    it("allows image elements with data scheme", function () {
      const str = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==">`
      const el = render(<Markdown source={str} />)
      expect(el.prop("outerHTML")).toEqual(`<div class="markdown"><p>` + str + `</p>\n</div>`)
    })

    it("allows heading elements", function () {
      const str = `
# h1
## h2
### h3
#### h4
##### h5
###### h6`
      const el = render(<Markdown source={str} />)
      expect(el.prop("outerHTML")).toEqual(`<div class="markdown"><h1>h1</h1>\n<h2>h2</h2>\n<h3>h3</h3>\n<h4>h4</h4>\n<h5>h5</h5>\n<h6>h6</h6>\n</div>`)
    })

    it("allows links", function () {
      const str = `[Link](https://example.com/)`
      const el = render(<Markdown source={str} />)
      expect(el.prop("outerHTML")).toEqual(`<div class="markdown"><p><a rel="noopener noreferrer" target="_blank" href="https://example.com/">Link</a></p>\n</div>`)
    })
  })

  describe("OAS 3", function () {
    it("allows elements with class, style and data-* attribs", function () {
      const getConfigs = () => ({ useUnsafeMarkdown: true })
      const str = `<span class="method" style="border-width: 1px" data-attr="value">ONE</span>`
      const el = render(<OAS3Markdown source={str} getConfigs={getConfigs} />)
      expect(el.prop("outerHTML")).toEqual(`<div class="renderedMarkdown"><p><span data-attr="value" style="border-width: 1px" class="method">ONE</span></p></div>`)
    })

    it("strips class, style and data-* attribs from elements", function () {
      const getConfigs = () => ({ useUnsafeMarkdown: false })
      const str = `<span class="method" style="border-width: 1px" data-attr="value">ONE</span>`
      const el = render(<OAS3Markdown source={str} getConfigs={getConfigs} />)
      expect(el.prop("outerHTML")).toEqual(`<div class="renderedMarkdown"><p><span>ONE</span></p></div>`)
    })

    it("allows image elements", function () {
      const str = `![Image alt text](http://image.source "Image title")`
      const el = render(<OAS3Markdown source={str} />)
      expect(el.prop("outerHTML")).toEqual(`<div class="renderedMarkdown"><p><img title="Image title" alt="Image alt text" src="http://image.source"></p></div>`)
    })

    it("allows image elements with https scheme", function () {
      const str = `![Image alt text](https://image.source "Image title")`
      const el = render(<OAS3Markdown source={str} />)
      expect(el.prop("outerHTML")).toEqual(`<div class="renderedMarkdown"><p><img title="Image title" alt="Image alt text" src="https://image.source"></p></div>`)
    })

    it("allows image elements with data scheme", function () {
      const str = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==">`
      const el = render(<OAS3Markdown source={str} />)
      expect(el.prop("outerHTML")).toEqual(`<div class="renderedMarkdown"><p>` + str + `</p></div>`)
    })

    it("allows heading elements", function () {
      const str = `
# h1
## h2
### h3
#### h4
##### h5
###### h6`
      const el = render(<OAS3Markdown source={str} />)
      expect(el.prop("outerHTML")).toEqual(`<div class="renderedMarkdown"><h1>h1</h1>\n<h2>h2</h2>\n<h3>h3</h3>\n<h4>h4</h4>\n<h5>h5</h5>\n<h6>h6</h6></div>`)
    })
  })
})
