/**
 * @prettier
 */

import React from "react"
import { shallow } from "enzyme"
import { fromJS, List } from "immutable"
import Callbacks from "core/plugins/oas3/components/callbacks"

describe("<Callbacks/>", () => {
  const OperationContainerStub = () => null
  OperationContainerStub.displayName = "OperationContainerStub"

  const buildOperationDTOs = () => ({
    myEvent: [
      {
        operation: fromJS({ operation: { summary: "myEvent op" } }),
        method: "post",
        path: "{$request.body#/callbackUrl}",
        callbackName: "myEvent",
        specPath: List([
          "paths",
          "/subscribe",
          "post",
          "callbacks",
          "myEvent",
          "{$request.body#/callbackUrl}",
          "post",
        ]),
      },
    ],
    otherEvent: [
      {
        operation: fromJS({ operation: { summary: "otherEvent op" } }),
        method: "post",
        path: "{$request.body#/callbackUrl}",
        callbackName: "otherEvent",
        specPath: List([
          "paths",
          "/subscribe",
          "post",
          "callbacks",
          "otherEvent",
          "{$request.body#/callbackUrl}",
          "post",
        ]),
      },
    ],
  })

  const buildProps = (operationDTOs) => ({
    callbacks: fromJS({}),
    specPath: List(["paths", "/subscribe", "post", "callbacks"]),
    specSelectors: {
      callbacksOperations: () => operationDTOs,
    },
    getComponent: (name) => {
      if (name === "OperationContainer") return OperationContainerStub
      return null
    },
  })

  it("renders one OperationContainer per callback path-item operation", () => {
    const wrapper = shallow(<Callbacks {...buildProps(buildOperationDTOs())} />)

    const operationContainers = wrapper.find(OperationContainerStub)
    expect(operationContainers.length).toEqual(2)
  })

  it("scopes the tag prop with the callback name so colliding URLs do not share expansion state", () => {
    // Regression test for https://github.com/swagger-api/swagger-ui/issues/5536
    // When two callbacks declare the same URL template, each OperationContainer
    // must receive a unique `tag` so that the layout isShownKey
    // (["operations", tag, operationId]) differs between callbacks.
    const wrapper = shallow(<Callbacks {...buildProps(buildOperationDTOs())} />)
    const operationContainers = wrapper.find(OperationContainerStub)

    const tags = operationContainers.map((node) => node.prop("tag"))
    expect(tags).toEqual(["callbacks-myEvent", "callbacks-otherEvent"])

    // tags must be unique across colliding URL templates
    expect(new Set(tags).size).toEqual(tags.length)
  })

  it("renders 'No callbacks' when the selector returns no operations", () => {
    const wrapper = shallow(<Callbacks {...buildProps({})} />)
    expect(wrapper.text()).toEqual("No callbacks")
  })
})
