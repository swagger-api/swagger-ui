/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"
import { shallow } from "enzyme"
import { fromJS, List } from "immutable"

import RequestBody from "core/plugins/oas3/components/request-body"

describe("<RequestBody/>", function () {
  const Markdown = ({ source }) => <div className="markdown-stub">{source}</div>
  Markdown.propTypes = { source: PropTypes.string }
  const Input = () => null
  const RequestBodyEditor = () => null
  const HighlightCode = () => null
  const ModelExample = () => null
  const ExamplesSelectValueRetainer = () => null
  const Example = () => null
  const ParameterIncludeEmpty = () => null

  const components = {
    Markdown,
    Input,
    RequestBodyEditor,
    HighlightCode,
    modelExample: ModelExample,
    ExamplesSelectValueRetainer,
    Example,
    ParameterIncludeEmpty,
  }

  const getComponentStub = (name) => components[name] || null

  const baseProps = {
    userHasEditedBody: false,
    requestBodyValue: fromJS({}),
    requestBodyInclusionSetting: fromJS({}),
    requestBodyErrors: List(),
    getComponent: getComponentStub,
    getConfigs: () => ({}),
    specSelectors: {},
    fn: {
      isFileUploadIntended: () => true,
      hasSchemaType: () => false,
      getSampleSchema: () => "",
    },
    specPath: List(),
    onChange: () => {},
    onChangeIncludeEmpty: () => {},
    updateActiveExamplesKey: () => {},
    setRetainRequestBodyValueFlag: () => {},
    oas3Actions: {},
  }

  it("renders the request body description for file upload content types when isExecute is true", function () {
    const props = {
      ...baseProps,
      isExecute: true,
      contentType: "application/octet-stream",
      requestBody: fromJS({
        description: "A zip file containing files that will be unzipped",
        content: {
          "application/octet-stream": {
            schema: { type: "string", format: "binary" },
          },
        },
      }),
    }

    const wrapper = shallow(<RequestBody {...props} />)

    const markdown = wrapper.find(Markdown)
    expect(markdown.length).toEqual(1)
    expect(markdown.prop("source")).toEqual(
      "A zip file containing files that will be unzipped"
    )
    expect(wrapper.find(Input).length).toEqual(1)
  })

  it("renders the request body description for file upload content types when isExecute is false", function () {
    const props = {
      ...baseProps,
      isExecute: false,
      contentType: "application/octet-stream",
      requestBody: fromJS({
        description: "A zip file containing files that will be unzipped",
        content: {
          "application/octet-stream": {
            schema: { type: "string", format: "binary" },
          },
        },
      }),
    }

    const wrapper = shallow(<RequestBody {...props} />)

    const markdown = wrapper.find(Markdown)
    expect(markdown.length).toEqual(1)
    expect(markdown.prop("source")).toEqual(
      "A zip file containing files that will be unzipped"
    )
    expect(wrapper.text()).toContain("Example values are not available")
  })

  it("does not render a Markdown description when the request body has none (isExecute true)", function () {
    const props = {
      ...baseProps,
      isExecute: true,
      contentType: "application/octet-stream",
      requestBody: fromJS({
        content: {
          "application/octet-stream": {
            schema: { type: "string", format: "binary" },
          },
        },
      }),
    }

    const wrapper = shallow(<RequestBody {...props} />)

    expect(wrapper.find(Markdown).length).toEqual(0)
    expect(wrapper.find(Input).length).toEqual(1)
  })

  it("does not render a Markdown description when the request body has none (isExecute false)", function () {
    const props = {
      ...baseProps,
      isExecute: false,
      contentType: "application/octet-stream",
      requestBody: fromJS({
        content: {
          "application/octet-stream": {
            schema: { type: "string", format: "binary" },
          },
        },
      }),
    }

    const wrapper = shallow(<RequestBody {...props} />)

    expect(wrapper.find(Markdown).length).toEqual(0)
    expect(wrapper.text()).toContain("Example values are not available")
  })
})
