import React from "react"
import expect from "expect"
import { shallow } from "enzyme"
import ResponseBody from "components/response-body"

describe("<ResponseBody />", function() {
  const highlightCodeComponent = () => null
  const components = {
    highlightCode: highlightCodeComponent
  }
  const props = {
    getComponent: c => components[c],
  }

  it("renders ResponseBody as 'application/json'", function() {
    props.contentType = "application/json"
    props.content = "{\"key\": \"a test value\"}"
    const wrapper = shallow(<ResponseBody {...props}/>)
    expect(wrapper.find("highlightCodeComponent").length).toEqual(1)
  })

  it("renders ResponseBody as 'text/html'", function() {
    props.contentType = "application/json"
    props.content = "<b>Result</b>"
    const wrapper = shallow(<ResponseBody {...props}/>)
    expect(wrapper.find("highlightCodeComponent").length).toEqual(1)
  })

  it("renders ResponseBody as 'image/svg'", function() {
    props.contentType = "image/svg"
    const wrapper = shallow(<ResponseBody {...props}/>)
    expect(wrapper.find("highlightCodeComponent").length).toEqual(0)
  })

  it("should render a copyable highlightCodeComponent for text types", function() {
    props.contentType = "text/plain"
    props.content = "test text"
    const wrapper = shallow(<ResponseBody {...props}/>)
    expect(wrapper.find("highlightCodeComponent[canCopy]").length).toEqual(1)
  })
})
