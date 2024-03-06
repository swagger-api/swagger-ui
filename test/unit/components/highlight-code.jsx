import React from "react"
import expect from "expect"
import { shallow, mount } from "enzyme"
import HighlightCode from "core/components/highlight-code"

const defaultSyntaxHighlightConfig = {
  activated: true,
  theme: "agate"
}

const fakeGetConfigs = (
  renderSizeThreshold = undefined,
  syntaxHighlight = defaultSyntaxHighlightConfig) => (
  {
    payload: {
      render: {
        sizeThreshold: renderSizeThreshold,
      }
    },
    syntaxHighlight: syntaxHighlight
  })

describe("<HighlightCode />", () => {
  it("should render a Download button if downloadable", () => {
    const props = { downloadable: true, getConfigs: fakeGetConfigs }
    const wrapper = shallow(<HighlightCode {...props} />)
    expect(wrapper.find(".download-contents").length).toEqual(1)
  })

  it("should render a Copy To Clipboard button if copyable", () => {
    const props = { canCopy: true, getConfigs: fakeGetConfigs }
    const wrapper = shallow(<HighlightCode {...props} />)
    expect(wrapper.find("CopyToClipboard").length).toEqual(1)
  })

  it("should render values in a preformatted element", () => {
    const value = "test text"
    const syntaxHighlightConfig = {
      activated: false
    }
    const props = { value: value, getConfigs: () => fakeGetConfigs(undefined, syntaxHighlightConfig) }
    const wrapper = mount(<HighlightCode {...props} />)
    const highlighterTag = wrapper.find("SyntaxHighlighter")
    expect(highlighterTag.length).toEqual(0)

    const preTag = wrapper.find("pre")
    expect(preTag.length).toEqual(1)
    expect(preTag.text()).toEqual(value)
  })

  it("should render values in a syntax highlighted element", () => {
    const value = "test text"
    const props = { value: value, getConfigs: fakeGetConfigs }
    const wrapper = mount(<HighlightCode {...props} />)
    const syntaxHighlighterTag = wrapper.find("SyntaxHighlighter")

    expect(syntaxHighlighterTag.length).toEqual(1)
    expect(syntaxHighlighterTag.text()).toEqual(value)
  })

  it("should not render values larger than threshold", () => {
    const value = "aaaaaaaa" //8 bytes
    const props = { value: value, getConfigs: () => fakeGetConfigs(7) }
    const wrapper = mount(<HighlightCode {...props} />)
    const infoTag = wrapper.find("div.microlight")

    expect(infoTag.text()).toEqual("Value is too large (8 bytes), rendering disabled.")
  })

  it("should not highlight values larger larger than syntax highlight threshold", () => {
    const value = "aaaaaaaa" //8 bytes
    const syntaxHighlightConfig = {
      defaultSyntaxHighlightConfig,
      sizeThreshold: 8
    }
    const props = { value: value, getConfigs: () => fakeGetConfigs(undefined, syntaxHighlightConfig) }
    const wrapper = mount(<HighlightCode {...props} />)
    const highlighterTag = wrapper.find("SyntaxHighlighter")
    expect(highlighterTag.length).toEqual(0)

    const preTag = wrapper.find("pre")
    expect(preTag.length).toEqual(1)
    expect(preTag.text()).toEqual(value)
  })
})
