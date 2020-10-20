import React from "react"
import { render } from "enzyme"
import Markdown from "components/providers/markdown"

describe("UI-3199: Sanitized Markdown causing code examples to be double escaped", function(){
  it("should single-escape quotes", function(){

    let str = "" +
    "This is a test: \n\n" +
    "    {\"abc\": \"def\"}\n"

    let props = {
      source: str
    }

    let el = render(<Markdown {...props}/>)

    expect(el.find("code").first().text()).toEqual("{\"abc\": \"def\"}\n")
    expect(el.find("code").first().html()).toEqual("{&quot;abc&quot;: &quot;def&quot;}\n")
  })
})
