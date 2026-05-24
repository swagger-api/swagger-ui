/**
 * @prettier
 *
 * Regression tests for https://github.com/swagger-api/swagger-ui/issues/10234
 *
 * When Swagger UI is rendered inside a host application's <form> element, any
 * native <button> without an explicit `type` attribute defaults to
 * `type="submit"` and triggers form submission on click. Every interactive
 * <button> rendered by Swagger UI must therefore set `type="button"`.
 */
/* eslint-disable react/jsx-no-bind */
import React from "react"
import { shallow } from "enzyme"
import Im from "immutable"

import AuthorizeBtn from "core/components/auth/authorize-btn"
import AuthorizeOperationBtn from "core/components/auth/authorize-operation-btn"
import Clear from "core/components/clear"
import Execute from "core/components/execute"
import OperationTag from "core/components/operation-tag"
import TryItOutButton from "core/components/try-it-out-button"
import ModelCollapse from "core/plugins/json-schema-5/components/model-collapse"

const noop = () => null

describe('a11y: native <button> elements default to type="button"', function () {
  it("AuthorizeBtn renders a non-submitting button", function () {
    const wrapper = shallow(
      <AuthorizeBtn
        getComponent={() => noop}
        onClick={() => {}}
        isAuthorized={false}
        showPopup={false}
      />
    )
    expect(wrapper.find("button").prop("type")).toEqual("button")
  })

  it("AuthorizeOperationBtn renders a non-submitting button", function () {
    const wrapper = shallow(
      <AuthorizeOperationBtn
        getComponent={() => noop}
        onClick={() => {}}
        isAuthorized={false}
      />
    )
    expect(wrapper.find("button").prop("type")).toEqual("button")
  })

  it("Clear renders a non-submitting button", function () {
    const wrapper = shallow(
      <Clear
        specActions={{ clearResponse: () => {}, clearRequest: () => {} }}
        path="/foo"
        method="get"
      />
    )
    expect(wrapper.find("button").prop("type")).toEqual("button")
  })

  it("Execute renders a non-submitting button", function () {
    const wrapper = shallow(
      <Execute
        specSelectors={{
          validateBeforeExecute: () => true,
        }}
        specActions={{
          validateParams: () => {},
          execute: () => {},
          clearValidateParams: () => {},
        }}
        operation={Im.Map()}
        path="/foo"
        method="get"
        oas3Selectors={{
          requestBodyValue: () => null,
          validateBeforeExecute: () => true,
          requestContentType: () => null,
          validateShallowRequired: () => [],
        }}
        oas3Actions={{
          clearRequestBodyValidateError: () => {},
          setRequestBodyValidateError: () => {},
        }}
      />
    )
    expect(wrapper.find("button").prop("type")).toEqual("button")
  })

  it("OperationTag expand button is non-submitting", function () {
    const wrapper = shallow(
      <OperationTag
        tagObj={Im.fromJS({})}
        tag="pets"
        oas3Selectors={() => null}
        layoutSelectors={{
          currentFilter: () => null,
          isShown: () => false,
          show: () => true,
        }}
        layoutActions={{ show: () => {} }}
        getConfigs={() => ({})}
        getComponent={() => noop}
        specUrl=""
      />
    )
    expect(wrapper.find("button.expand-operation").prop("type")).toEqual(
      "button"
    )
  })

  it("TryItOutButton 'Try it out' is a non-submitting button", function () {
    const wrapper = shallow(
      <TryItOutButton enabled={false} isOAS3 hasUserEditedBody={false} />
    )
    expect(wrapper.find("button").prop("type")).toEqual("button")
  })

  it("TryItOutButton 'Cancel' and 'Reset' are non-submitting buttons", function () {
    const wrapper = shallow(<TryItOutButton enabled isOAS3 hasUserEditedBody />)
    const buttons = wrapper.find("button")
    expect(buttons.length).toEqual(2)
    buttons.forEach((node) => {
      expect(node.prop("type")).toEqual("button")
    })
  })

  it("ModelCollapse toggle button is non-submitting", function () {
    const wrapper = shallow(
      <ModelCollapse
        layoutSelectors={{ getScrollToKey: () => Im.List() }}
        specPath={Im.List([])}
      >
        <span>contents</span>
      </ModelCollapse>
    )
    expect(wrapper.find("button.model-box-control").prop("type")).toEqual(
      "button"
    )
  })
})
