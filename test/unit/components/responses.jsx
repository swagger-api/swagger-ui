import React from "react"
import { fromJS } from "immutable"
import { shallow } from "enzyme"
import Responses from "core/components/responses"

describe("<Responses/>", function () {
  const baseProps = {
    responses: fromJS({ "200": { description: "OK" } }),
    tryItOutResponse: null,
    displayRequestDuration: false,
    path: "/pets",
    method: "get",
    getComponent: () => () => null,
    getConfigs: () => ({}),
    specSelectors: {
      isOAS3: () => false,
    },
    specActions: {},
    oas3Actions: {},
    oas3Selectors: {
      activeExamplesMember: () => null,
    },
    specPath: fromJS([]),
    fn: {},
  }

  it("does not render 'Possible responses' heading when no server response", function () {
    const wrapper = shallow(<Responses {...baseProps} />)
    expect(wrapper.find("h4").map((n) => n.text())).not.toContain("Possible responses")
  })

  it("renders 'Possible responses' heading when a server response is present", function () {
    const props = {
      ...baseProps,
      tryItOutResponse: fromJS({ status: 200, headers: {}, text: "" }),
      getComponent: (name) => {
        if (name === "liveResponse") return () => null
        return () => null
      },
    }
    const wrapper = shallow(<Responses {...props} />)
    const h4Texts = wrapper.find("h4").map((n) => n.text())
    expect(h4Texts).toContain("Possible responses")
  })

  it("wraps the responses table in .possible-responses-wrapper regardless of server response", function () {
    const wrapper = shallow(<Responses {...baseProps} />)
    expect(wrapper.find("div.possible-responses-wrapper").length).toEqual(1)
  })
})
