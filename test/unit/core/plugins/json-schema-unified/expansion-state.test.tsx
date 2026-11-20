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

const makeProps = (
  JSONSchemaUnified: React.ComponentType,
  overrides: Record<string, unknown> = {}
) => ({
  schemasPath: ["components", "schemas"],
  specSelectors: { specResolvedSubtree: () => ({}) },
  specActions: { requestResolvedSubtree: () => {} },
  layoutActions: { show: () => {}, readyToScroll: () => {} },
  getComponent: (name: string) =>
    name === "JSONSchemaUnified" ? JSONSchemaUnified : null,
  ...overrides,
})

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

  describe("driven from outside (`expanded`)", () => {
    const schema = { type: "object", properties: { a: { type: "string" } } }

    it("expands and collapses with the prop, and starts as it says", () => {
      const JSONSchemaUnified = makeInstance()
      const wrapper = mount(<JSONSchemaUnified schema={schema} name="Pet" />)
      expect(isExpanded(wrapper.getDOMNode())).toBe(false)

      wrapper.setProps({ expanded: true })
      expect(isExpanded(schemaElement(wrapper))).toBe(true)
      wrapper.setProps({ expanded: false })
      expect(isExpanded(schemaElement(wrapper))).toBe(false)

      const Open = makeInstance()
      expect(
        isExpanded(
          mount(<Open schema={schema} name="Pet" expanded />).getDOMNode()
        )
      ).toBe(true)
    })

    it("leaves the config's expansion when it is undefined", () => {
      const JSONSchemaUnified = makeInstance()
      const wrapper = mount(<JSONSchemaUnified schema={schema} name="Pet" />)

      wrapper.find("button").first().simulate("click")
      expect(isExpanded(schemaElement(wrapper))).toBe(true)
      wrapper.setProps({ expanded: undefined })
      expect(isExpanded(schemaElement(wrapper))).toBe(true)
    })

    it("calls onExpand for a click only, not for a change from outside", () => {
      const onExpand = jest.fn()
      const JSONSchemaUnified = makeInstance()
      const wrapper = mount(
        <JSONSchemaUnified schema={schema} name="Pet" onExpand={onExpand} />
      )

      wrapper.setProps({ expanded: true })
      wrapper.setProps({ expanded: false })
      expect(onExpand).not.toHaveBeenCalled()

      wrapper.find("button").first().simulate("click")
      expect(onExpand).toHaveBeenCalledTimes(1)
    })
  })

  describe("Schemas section item shown from outside (`isShown`)", () => {
    const schema = { type: "object", properties: { a: { type: "string" } } }
    const resolve = () => ({
      specSelectors: { specResolvedSubtree: () => null },
      specActions: { requestResolvedSubtree: jest.fn() },
    })

    it("expands and collapses with isShown, and keeps the default without it", () => {
      const props = makeProps(makeInstance())
      const wrapper = mount(
        <SchemaItem {...props} schemaName="Pet" name="Pet" schema={schema} />
      )
      expect(isExpanded(schemaElement(wrapper))).toBe(false)

      wrapper.setProps({ isShown: true })
      expect(isExpanded(schemaElement(wrapper))).toBe(true)
      wrapper.setProps({ isShown: false })
      expect(isExpanded(schemaElement(wrapper))).toBe(false)

      expect(
        isExpanded(
          schemaElement(
            mount(
              <SchemaItem
                {...makeProps(makeInstance())}
                schemaName="Pet"
                name="Pet"
                schema={schema}
                isShown
              />
            )
          )
        )
      ).toBe(true)
    })

    it("requests the resolved subtree when it is shown and not resolved", () => {
      const { specSelectors, specActions } = resolve()
      const props = makeProps(makeInstance(), { specSelectors, specActions })
      const wrapper = mount(
        <SchemaItem {...props} schemaName="Pet" name="Pet" schema={schema} />
      )
      expect(specActions.requestResolvedSubtree).not.toHaveBeenCalled()

      wrapper.setProps({ isShown: true })
      expect(specActions.requestResolvedSubtree).toHaveBeenCalledWith([
        "components",
        "schemas",
        "Pet",
      ])

      // a resolved schema is not requested again
      const resolved = makeProps(makeInstance(), {
        specActions: { requestResolvedSubtree: jest.fn() },
      })
      mount(
        <SchemaItem
          {...resolved}
          schemaName="Pet"
          name="Pet"
          schema={schema}
          isShown
        />
      )
      expect(resolved.specActions.requestResolvedSubtree).not.toHaveBeenCalled()
    })

    it("requests the resolved subtree again when an edit replaces the schema", () => {
      const { specSelectors, specActions } = resolve()
      const props = makeProps(makeInstance(), { specSelectors, specActions })
      const wrapper = mount(
        <SchemaItem
          {...props}
          schemaName="Pet"
          name="Pet"
          schema={schema}
          isShown
        />
      )
      expect(specActions.requestResolvedSubtree).toHaveBeenCalledTimes(1)

      // same schema again: nothing to ask for
      wrapper.setProps({ name: "Pet again" })
      expect(specActions.requestResolvedSubtree).toHaveBeenCalledTimes(1)

      wrapper.setProps({ schema: { ...schema, description: "edited" } })
      expect(specActions.requestResolvedSubtree).toHaveBeenCalledTimes(2)

      // a shown schema that is resolved does not ask again after an edit
      const resolved = makeProps(makeInstance(), {
        specActions: { requestResolvedSubtree: jest.fn() },
      })
      const other = mount(
        <SchemaItem
          {...resolved}
          schemaName="Pet"
          name="Pet"
          schema={schema}
          isShown
        />
      )
      other.setProps({ schema: { ...schema, description: "edited" } })
      expect(resolved.specActions.requestResolvedSubtree).not.toHaveBeenCalled()
    })

    it("writes the layout on a click and stays consistent when it comes back", () => {
      const show = jest.fn()
      const props = makeProps(makeInstance(), {
        layoutActions: { show, readyToScroll: () => {} },
      })
      const wrapper = mount(
        <SchemaItem {...props} schemaName="Pet" name="Pet" schema={schema} />
      )

      wrapper.find("button").first().simulate("click")
      expect(show).toHaveBeenLastCalledWith(
        ["components", "schemas", "Pet"],
        true
      )
      wrapper.setProps({ isShown: true })
      expect(isExpanded(schemaElement(wrapper))).toBe(true)

      wrapper.find("button").first().simulate("click")
      expect(show).toHaveBeenLastCalledWith(
        ["components", "schemas", "Pet"],
        false
      )
      wrapper.setProps({ isShown: false })
      expect(isExpanded(schemaElement(wrapper))).toBe(false)
    })

    it.each(["Pet", "My Pet"])("gives its element the id model-%s", (name) => {
      const wrapper = mount(
        <SchemaItem
          {...makeProps(makeInstance())}
          schemaName={name}
          name={name}
          schema={schema}
        />
      )

      expect(schemaElement(wrapper).getAttribute("id")).toBe(`model-${name}`)
    })
  })
})
