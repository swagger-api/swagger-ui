/**
 * @prettier
 */
import React from "react"
import { mount } from "enzyme"

import { withJSONSchemaContext } from "core/plugins/json-schema-2020-12/hoc"
import RealJSONSchema from "core/plugins/json-schema-2020-12/components/JSONSchema/JSONSchema"
import { makeGetTitle, upperFirst } from "core/plugins/json-schema-2020-12/fn"
import { EMPTY_NAME_LABEL } from "core/plugins/json-schema-document/fn"
import JSONSchemaDocumentDefinitions from "core/plugins/json-schema-document/components/JSONSchemaDocumentDefinitions"

const JSONSchema = ({ name }: { name?: string }) => (
  <div className="json-schema-stub">{name}</div>
)
const Stub = ({ name, identifier }: Record<string, unknown>) => (
  <div className="json-schema-stub" data-identifier={identifier}>
    {String(name)}
  </div>
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
const getTitle = (schema: unknown) => (schema as { title?: string }).title ?? ""

const render = (isOpenDefault?: boolean) =>
  mount(
    <JSONSchemaDocumentDefinitions
      definitions={{ A: { type: "string" }, B: { type: "integer" } }}
      JSONSchema={JSONSchema}
      getComponent={getComponent}
      getTitle={getTitle}
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

  it('gives each entry its name as its path, and an entry named "" a path no name is', () => {
    const stubs = (definitions: Record<string, unknown>) =>
      mount(
        <JSONSchemaDocumentDefinitions
          definitions={definitions}
          JSONSchema={Stub}
          getComponent={getComponent}
          getTitle={getTitle}
        />
      )
        .find(".json-schema-stub")
        .map((n) => [n.prop("data-identifier"), n.text()])

    expect(stubs({ "": {}, foo: {}, bar: { title: "T" } })).toEqual([
      [EMPTY_NAME_LABEL, EMPTY_NAME_LABEL],
      ["foo", "foo"],
      ["bar", "bar"],
    ])
    expect(stubs({ "": {}, [EMPTY_NAME_LABEL]: {} })).toEqual([
      [`${EMPTY_NAME_LABEL}_`, EMPTY_NAME_LABEL],
      // a name equal to the label is quoted, to tell it from the label
      [EMPTY_NAME_LABEL, `"${EMPTY_NAME_LABEL}"`],
    ])
    // a titled entry named "" shows its title, not the label
    expect(stubs({ "": { title: "T" } })).toEqual([[EMPTY_NAME_LABEL, ""]])
  })

  describe("with the json-schema-2020-12 renderer", () => {
    type C = React.ComponentType<Record<string, unknown>>
    const object = { type: "object", properties: { a: { type: "string" } } }
    const Renderer = withJSONSchemaContext(RealJSONSchema, {
      config: { defaultExpandedLevels: 5 },
      fn: { getTitle: makeGetTitle(() => ({ upperFirst })) },
    }) as C
    const mountReal = (definitions: Record<string, unknown>) =>
      mount(
        <JSONSchemaDocumentDefinitions
          definitions={definitions}
          JSONSchema={Renderer}
          getComponent={getComponent}
          getTitle={makeGetTitle(() => ({ upperFirst })) as typeof getTitle}
        />
      )
    const expanded = (wrapper: ReturnType<typeof mountReal>) =>
      wrapper
        .find("article.json-schema-2020-12")
        .filterWhere((a) => a.prop("data-json-schema-level") === 0)
        .map((a) =>
          a
            .find("button.json-schema-2020-12-accordion")
            .first()
            .prop("aria-expanded")
        )
    const rerender = (wrapper: ReturnType<typeof mountReal>) => {
      wrapper.find("button.models-control").simulate("click")
      wrapper.find("button.models-control").simulate("click")
      wrapper.update()
    }

    it('doesn\'t let collapsing all of an entry named "" collapse the others', () => {
      const wrapper = mountReal({ "": object, foo: object })

      expect(expanded(wrapper)).toEqual([true, true])
      wrapper
        .find("button.json-schema-2020-12-expand-deep-button")
        .first()
        .simulate("click")
      rerender(wrapper)

      expect(expanded(wrapper)).toEqual([false, true])
    })

    it("doesn't couple an entry's $id with the name of another entry", () => {
      const wrapper = mountReal({ a: { ...object, $id: "b" }, b: object })

      wrapper
        .find("button.json-schema-2020-12-accordion")
        .first()
        .simulate("click")
      rerender(wrapper)

      expect(expanded(wrapper)).toEqual([false, true])
    })

    it('gives an entry named "" an accessible name', () => {
      const wrapper = mountReal({ "": object })

      expect(
        wrapper
          .find("button.json-schema-2020-12-accordion")
          .first()
          .find(".json-schema-2020-12-accordion__children")
          .text()
      ).not.toBe("")
    })

    it("shows the title of an untitled-named entry, not its label", () => {
      const wrapper = mountReal({ "": { ...object, title: "Titled" } })

      expect(
        wrapper.find("button.json-schema-2020-12-accordion").first().text()
      ).toBe("Titled")
    })
  })
})
