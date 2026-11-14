/**
 * @prettier
 */
import React from "react"
import { render } from "enzyme"
import { fromJS } from "immutable"
import OperationExt from "core/components/operation-extensions"
import OperationExtRow from "core/components/operation-extension-row"
import { getExtensions } from "core/utils"

function getComponent() {
  return OperationExtRow
}

describe("<OperationExt/>", () => {
  it.each([
    [false, "false"],
    [0, "0"],
    ["", '""'],
    [null, "null"],
    [true, "true"],
    [42, "42"],
    ["value", '"value"'],
    [{ enabled: false }, '{"enabled":false}'],
    [[false, 0, ""], '[false,0,""]'],
  ])("renders extension value %p as %s", (value, expected) => {
    const extensions = getExtensions(fromJS({ "x-value": value }))
    const wrapper = render(
      <OperationExt extensions={extensions} getComponent={getComponent} />
    )

    expect(wrapper.find("tbody td").first().text()).toBe("x-value")
    expect(wrapper.find("tbody td").last().text()).toBe(expected)
  })
})
