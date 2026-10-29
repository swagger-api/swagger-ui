/**
 * @prettier
 */
import React from "react"
import { shallow } from "enzyme"
import { fromJS, List } from "immutable"
import Operation from "core/components/operation"
import OperationSummaryMethod from "core/components/operation-summary-method"
import { OperationLink } from "core/components/overview"

describe("Additional operation presentation", () => {
  it.each(["Search-Pets", "SEARCH", "search", "M-SEARCH"])(
    "preserves the %s token in method labels",
    (method) => {
      expect(shallow(<OperationSummaryMethod method={method} />).text()).toBe(
        method
      )
      expect(
        shallow(<OperationLink method={method} id="operation" />)
          .find("small")
          .text()
      ).toBe(method)
    }
  )

  it("keeps the standard GET badge uppercase", () => {
    expect(shallow(<OperationSummaryMethod method="get" />).text()).toBe("GET")
  })

  it.each([false, true])("uses neutral styling when expanded=%s", (isShown) => {
    const getComponent = jest.fn().mockReturnValue("div")
    const getConfigs = jest.fn().mockReturnValue({})
    const wrapper = shallow(
      <Operation
        operation={fromJS({
          method: "Search-Pets",
          path: "/pets",
          tag: "pets",
          operationId: "searchPets",
          isShown,
          op: {},
        })}
        specPath={List([
          "paths",
          "/pets",
          "additionalOperations",
          "Search-Pets",
        ])}
        getComponent={getComponent}
        getConfigs={getConfigs}
        specSelectors={{
          operationScheme: () => null,
          validationErrors: () => List(),
        }}
        oas3Selectors={{ selectedServer: () => null }}
      />
    )

    expect(wrapper.hasClass("opblock-custom")).toBe(true)
    expect(wrapper.hasClass("is-open")).toBe(isShown)
    expect(wrapper.hasClass("opblock-search-pets")).toBe(false)
  })
})
