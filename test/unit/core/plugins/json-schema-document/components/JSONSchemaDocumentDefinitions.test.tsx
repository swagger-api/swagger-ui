/**
 * @prettier
 */
import React from "react"
import { mount } from "enzyme"

import JSONSchemaDocumentDefinitions from "core/plugins/json-schema-document/components/JSONSchemaDocumentDefinitions"

const JSONSchema = ({ name }: { name?: string }) => (
  <div className="json-schema-stub">{name}</div>
)
const Collapse = ({
  isOpened,
  children,
}: {
  isOpened: boolean
  children?: React.ReactNode
}) => <div className={isOpened ? "opened" : "closed"}>{children}</div>
const Icon = () => <svg />
const components: Record<string, unknown> = {
  Collapse,
  ArrowUpIcon: Icon,
  ArrowDownIcon: Icon,
}

const getComponent = (name: string) => components[name]

const render = (isOpenDefault?: boolean) =>
  mount(
    <JSONSchemaDocumentDefinitions
      definitions={{ A: { type: "string" }, B: { type: "integer" } }}
      JSONSchema={JSONSchema}
      getComponent={getComponent}
      isOpenDefault={isOpenDefault}
    />
  )

describe("<JSONSchemaDocumentDefinitions />", () => {
  it("lists every definition by name, open by default", () => {
    const wrapper = render()

    expect(wrapper.find("button.models-control span").text()).toBe(
      "Schemas ($defs)"
    )
    expect(wrapper.find("section").hasClass("is-open")).toBe(true)
    expect(wrapper.find(".opened")).toHaveLength(1)
    expect(wrapper.find(".json-schema-stub").map((n) => n.text())).toEqual([
      "A",
      "B",
    ])
  })

  it("can start closed, and toggles", () => {
    const wrapper = render(false)

    expect(wrapper.find("button").prop("aria-expanded")).toBe(false)
    expect(wrapper.find(".closed")).toHaveLength(1)

    wrapper.find("button").simulate("click")

    expect(wrapper.find("button").prop("aria-expanded")).toBe(true)
    expect(wrapper.find("section").hasClass("is-open")).toBe(true)
  })
})
