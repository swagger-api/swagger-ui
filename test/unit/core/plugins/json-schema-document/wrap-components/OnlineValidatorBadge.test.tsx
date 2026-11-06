/**
 * @prettier
 */
import React from "react"
import { mount } from "enzyme"

import OnlineValidatorBadgeWrapper from "core/plugins/json-schema-document/wrap-components/OnlineValidatorBadge"

const Original = () => <div className="validator-badge" />

const render = (isJSONSchemaDocument: boolean) => {
  const Wrapped = OnlineValidatorBadgeWrapper(Original, {
    specSelectors: { isJSONSchemaDocument: () => isJSONSchemaDocument },
  })
  return mount(<Wrapped />)
}

describe("onlineValidatorBadge wrapper", () => {
  it("renders nothing for a JSON Schema document", () => {
    expect(render(true).find(".validator-badge")).toHaveLength(0)
  })

  it("renders the original badge for every other document", () => {
    expect(render(false).find(".validator-badge")).toHaveLength(1)
  })
})
