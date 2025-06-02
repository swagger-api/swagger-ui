import React from "react"
import expect from "expect"
import { shallow, mount } from "enzyme"
import HighlightCode from "core/plugins/syntax-highlighting/components/HighlightCode"
import SyntaxHighlighter from "core/plugins/syntax-highlighting/components/SyntaxHighlighter"

const fakeGetConfigs = () => ({ syntaxHighlight: { activated: true, theme: "agate" }})
const fakeGetComponent = (name, isContainer) => {
  const components = { HighlightCode, SyntaxHighlighter }
  const Component = components[name]

  if (isContainer) {
    return ({ ...props }) => {
      return <Component getConfigs={fakeGetConfigs} getComponent={fakeGetComponent} {...props} />
    }
  }

  return Component
}

describe("<HighlightCode />", () => {
  it("should render a Download button if downloadable", () => {
    const props = { downloadable: true, getConfigs: fakeGetConfigs, getComponent: fakeGetComponent }
    const wrapper = shallow(<HighlightCode {...props} />)
    expect(wrapper.find(".download-contents").length).toEqual(1)
  })

  it("should render a Copy To Clipboard button if copyable", () => {
    const props = { canCopy: true, getConfigs: fakeGetConfigs, getComponent: fakeGetComponent }
    const wrapper = shallow(<HighlightCode {...props} />)
    expect(wrapper.find("CopyToClipboard").length).toEqual(1)
  })

  it("should render values in a preformatted element", () => {
    const value = "test text"
    const props = { children: value , getConfigs: fakeGetConfigs, getComponent: fakeGetComponent }
    const wrapper = mount(<HighlightCode {...props} />)
    const preTag = wrapper.find("pre")

    expect(preTag.length).toEqual(1)
    expect(preTag.text()).toEqual(value)
  })
})
