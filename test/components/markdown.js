/* eslint-env mocha */
import React from "react"
import expect from "expect"
import { render } from "enzyme"
import Markdown from "components/providers/markdown"
import { Markdown as OAS3Markdown } from "corePlugins/oas3/wrap-components/markdown.js"

describe("Markdown component", function() {
    describe("Swagger 2.0", function() {
        it("allows image elements", function() {
            const str = `![Image alt text](http://image.source "Image title")`
            const el = render(<Markdown source={str} />)
            expect(el.html()).toEqual(`<div class="markdown"><p><img src="http://image.source" title="Image title"></p>\n</div>`)
        })

        it("allows heading elements", function() {
            const str = `
# h1
## h2
### h3
#### h4
##### h5
###### h6`
            const el = render(<Markdown source={str} />)
            expect(el.html()).toEqual(`<div class="markdown"><h1>h1</h1>\n<h2>h2</h2>\n<h3>h3</h3>\n<h4>h4</h4>\n<h5>h5</h5>\n<h6>h6</h6>\n</div>`)
        })

        it("allows links", function() {
            const str = `[Link](https://example.com/)`
            const el = render(<Markdown source={str} />)
            expect(el.html()).toEqual(`<div class="markdown"><p><a href="https://example.com/" target="_blank">Link</a></p>\n</div>`)
        })
    })

    describe("OAS 3", function() {
        it("allows image elements", function() {
            const str = `![Image alt text](http://image.source "Image title")`
            const el = render(<OAS3Markdown source={str} />)
            expect(el.html()).toEqual(`<div class="renderedMarkdown"><div><p><img src="http://image.source" title="Image title"></p></div></div>`)
        })

        it("allows heading elements", function() {
            const str = `
# h1
## h2
### h3
#### h4
##### h5
###### h6`
            const el = render(<OAS3Markdown source={str} />)
            expect(el.html()).toEqual(`<div class="renderedMarkdown"><div><h1>h1</h1>\n<h2>h2</h2>\n<h3>h3</h3>\n<h4>h4</h4>\n<h5>h5</h5>\n<h6>h6</h6></div></div>`)
        })
    })
})
