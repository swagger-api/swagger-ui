import React from "react"
import { render } from "enzyme"
import Markdown from "components/providers/markdown"
import { Markdown as OAS3Markdown } from "corePlugins/oas3/wrap-components/markdown.jsx"

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

    it("sanitizes <form> elements", function() {
      const str = `"<form action='https://do.not.use.url/fake' method='post' action='java'><input type='email' id='email' placeholder='Email-address' name='email' value=''><button type='submit'>Login</button>"`
      const el = render(<Markdown source={str} />)
      expect(el.html()).toEqual(`<div class="markdown"><p>&quot;</p><input value name="email" placeholder="Email-address" id="email" type="email"><button type="submit">Login</button>&quot;<p></p>\n</div>`)
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

    it("sanitizes <form> elements", function () {
      const str = `"<form action='https://do.not.use.url/fake' method='post' action='java'><input type='email' id='email' placeholder='Email-address' name='email' value=''><button type='submit'>Login</button>"`
      const el = render(<OAS3Markdown source={str} />)
      expect(el.html()).toEqual(`<div class="renderedMarkdown"><p>&quot;</p><input value name="email" placeholder="Email-address" id="email" type="email"><button type="submit">Login</button>&quot;<p></p></div>`)
    })
  })
})
