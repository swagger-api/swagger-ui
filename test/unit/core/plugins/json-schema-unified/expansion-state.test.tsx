/**
 * @prettier
 */
import React from "react"
import { mount } from "enzyme"

import Markdown from "core/components/providers/markdown"
import JSONSchema from "core/plugins/json-schema-unified/components/JSONSchema/JSONSchema"
import SchemaItem from "core/plugins/json-schema-unified/components/Models/SchemaItem"
import { withJSONSchemaContext } from "core/plugins/json-schema-unified/hoc"
import { getOASDialectOverrides } from "core/plugins/json-schema-unified/dialects"

const makeInstance = () => {
  const overrides = getOASDialectOverrides("oas31", {
    includeReadOnly: true,
    includeWriteOnly: true,
  })
  return withJSONSchemaContext(JSONSchema, {
    config: { ...overrides.config },
    fn: overrides.fn,
    components: { ...overrides.components, Markdown },
  })
}

const isExpanded = (element: Element) =>
  element.getAttribute("data-expanded") === "true"

/** The first schema element of a mounted tree (the root may be a memo component). */
const schemaElement = (wrapper: ReturnType<typeof mount>): Element =>
  wrapper
    .update()
    .find("[data-json-schema-unified]")
    .hostNodes()
    .first()
    .getDOMNode()

describe("json-schema-unified expansion state", () => {
  describe("schema names that are Object.prototype members", () => {
    const schema = { type: "object", properties: { a: { type: "string" } } }

    it.each(["__proto__", "constructor", "toString", "hasOwnProperty"])(
      "starts %s collapsed and toggles it",
      (name) => {
        const JSONSchemaUnified = makeInstance()
        const wrapper = mount(<JSONSchemaUnified schema={schema} name={name} />)
        const toggle = () => {
          wrapper.find("button").first().simulate("click")
          wrapper.update()
        }

        expect(isExpanded(wrapper.getDOMNode())).toBe(false)
        toggle()
        expect(isExpanded(wrapper.getDOMNode())).toBe(true)
        toggle()
        expect(isExpanded(wrapper.getDOMNode())).toBe(false)
      }
    )
  })

  describe("Schemas section item", () => {
    const makeProps = (JSONSchemaUnified: React.ComponentType) => ({
      schemasPath: ["components", "schemas"],
      specSelectors: { specResolvedSubtree: () => ({}) },
      specActions: { requestResolvedSubtree: () => {} },
      layoutActions: { show: () => {}, readyToScroll: () => {} },
      getComponent: (name: string) =>
        name === "JSONSchemaUnified" ? JSONSchemaUnified : null,
    })

    it("stays expanded when the resolved schema renames it", () => {
      const JSONSchemaUnified = makeInstance()
      const props = makeProps(JSONSchemaUnified)
      const wrapper = mount(
        <SchemaItem
          {...props}
          schemaName="Alias"
          name="Alias"
          schema={{ $ref: "#/components/schemas/Animal" }}
        />
      )

      wrapper.find("button").first().simulate("click")
      expect(isExpanded(schemaElement(wrapper))).toBe(true)

      // expanding requested the resolved subtree: the title is now the target's
      wrapper.setProps({
        name: "Animal",
        schema: {
          title: "Animal",
          type: "object",
          properties: { a: { type: "string" } },
        },
      })
      wrapper.update()

      expect(isExpanded(schemaElement(wrapper))).toBe(true)
    })

    it("keeps schemas with the same title apart", () => {
      const JSONSchemaUnified = makeInstance()
      const props = makeProps(JSONSchemaUnified)
      const schema = { type: "object", properties: { a: { type: "string" } } }
      // the second schema mounts after the first was expanded, as a virtualized
      // or lazily rendered list does: it must not start with the first's state
      const Pair = ({ showSecond }: { showSecond: boolean }) => (
        <div>
          <SchemaItem {...props} schemaName="A" name="Same" schema={schema} />
          {showSecond && (
            <SchemaItem {...props} schemaName="B" name="Same" schema={schema} />
          )}
        </div>
      )
      const wrapper = mount(<Pair showSecond={false} />)

      wrapper.find("button").first().simulate("click")
      wrapper.setProps({ showSecond: true })
      const [first, second] = Array.from<Element>(
        wrapper
          .update()
          .getDOMNode()
          .querySelectorAll(":scope > [data-json-schema-unified]")
      )

      expect(isExpanded(first)).toBe(true)
      expect(isExpanded(second)).toBe(false)
    })
  })
})
