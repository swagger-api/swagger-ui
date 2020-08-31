import React from "react"
import { render } from "enzyme"
import Markdown from "components/providers/markdown"

describe("UI-3279: Empty Markdown inputs causing bare `undefined` in output", function(){
  it("should return no text for `null` as source input", function(){
    let props = {
      source: null
    }

    let el = render(<Markdown {...props}/>)

    expect(el.text()).toEqual("")
  })

  it("should return no text for `undefined` as source input", function(){
    let props = {
      source: undefined
    }

    let el = render(<Markdown {...props}/>)

    expect(el.text()).toEqual("")
  })

  it("should return no text for empty string as source input", function(){
    let props = {
      source: ""
    }

    let el = render(<Markdown {...props}/>)

    expect(el.text()).toEqual("")
  })
})
