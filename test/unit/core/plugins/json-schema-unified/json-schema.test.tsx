/**
 * @prettier
 */
import React from "react"
import { mount } from "enzyme"

import JSONSchemaUnifiedPlugin from "core/plugins/json-schema-unified"
import JSONSchema from "core/plugins/json-schema-unified/components/JSONSchema/JSONSchema"
import { withJSONSchemaContext } from "core/plugins/json-schema-unified/hoc"
import { PROPERTY_REQUIRED } from "core/plugins/json-schema-unified/styles"

const schema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "Pet",
  type: "object",
  required: ["name"],
  properties: {
    name: { type: "string" },
    tags: { type: "array", items: { $ref: "#/$defs/Tag" } },
  },
  allOf: [{ title: "Base", properties: { id: { type: "integer" } } }],
  $defs: { Tag: { type: "string" } },
}

const render = () => {
  const JSONSchemaUnified = withJSONSchemaContext(JSONSchema)
  return mount(<JSONSchemaUnified schema={schema} name="Pet" />)
}

const getRoot = (wrapper: ReturnType<typeof mount>): HTMLElement =>
  wrapper.getDOMNode()

describe("json-schema-unified <JSONSchema />", () => {
  it("renders the root with its automation hooks", () => {
    const root = getRoot(render())

    expect(root.tagName).toBe("ARTICLE")
    expect(root.hasAttribute("data-json-schema-unified")).toBe(true)
    expect(root.getAttribute("data-schema-name")).toBe("Pet")
    expect(root.getAttribute("data-expanded")).toBe("false")
    expect(root.querySelector("[data-json-schema-title]").textContent).toBe(
      "Pet"
    )
  })

  it("toggles expansion and renders the ported keywords", () => {
    const wrapper = render()
    const root = getRoot(wrapper)
    const accordion = () => wrapper.find("button").first()

    expect(accordion().prop("data-expanded")).toBe("false")
    expect(root.querySelector('[data-keyword="properties"]')).toBeNull()

    accordion().simulate("click")

    expect(root.getAttribute("data-expanded")).toBe("true")
    expect(accordion().prop("data-expanded")).toBe("true")
    expect(root.querySelector('[data-keyword="properties"]')).not.toBeNull()
    expect(root.querySelector('[data-keyword="allOf"]')).not.toBeNull()
    expect(root.querySelector('[data-keyword="$defs"]')).not.toBeNull()
    expect(
      root.querySelector('[data-keyword="$schema"]').textContent
    ).toContain("https://json-schema.org/draft/2020-12/schema")
    expect(
      root.querySelector('[data-json-schema-unified][data-schema-name="name"]')
    ).not.toBeNull()

    accordion().simulate("click")

    expect(root.getAttribute("data-expanded")).toBe("false")
    expect(root.querySelector('[data-keyword="properties"]')).toBeNull()
  })

  it("expands deeply down to items and $ref", () => {
    const wrapper = render()
    const root = getRoot(wrapper)

    wrapper.find("button").at(1).simulate("click") // "Expand all"
    wrapper.update()

    const items = root.querySelector('[data-keyword="items"]')
    expect(items).not.toBeNull()
    expect(items.querySelector('[data-keyword="$ref"]').textContent).toContain(
      "#/$defs/Tag"
    )
    const allOf = root.querySelector('[data-keyword="allOf"]')
    expect(allOf.getAttribute("data-expanded")).toBe("true")
    expect(
      allOf.querySelector(
        '[data-schema-name="#0 Base"] [data-keyword="properties"]'
      )
    ).not.toBeNull()
  })

  it("styles only with sui: utilities", () => {
    const wrapper = render()
    const root = getRoot(wrapper)
    wrapper.find("button").at(1).simulate("click")
    wrapper.update()

    const classTokens = [root, ...Array.from(root.querySelectorAll("*"))]
      .flatMap((element) => Array.from(element.classList))
      .filter(Boolean)

    expect(classTokens.length).toBeGreaterThan(0)
    expect(
      classTokens.filter((token) => token.startsWith("json-schema-2020-12"))
    ).toEqual([])
    expect(classTokens.filter((token) => !token.startsWith("sui:"))).toEqual([])
  })

  it("marks required properties", () => {
    const wrapper = render()
    const root = getRoot(wrapper)
    wrapper.find("button").first().simulate("click")

    const [nameItem, tagsItem] = Array.from(
      root.querySelectorAll('[data-keyword="properties"] > ul > li')
    )
    const requiredClasses = PROPERTY_REQUIRED.split(" ")

    expect(requiredClasses.every((c) => nameItem.classList.contains(c))).toBe(
      true
    )
    expect(requiredClasses.some((c) => tagsItem.classList.contains(c))).toBe(
      false
    )
  })
})

describe("json-schema-unified plugin", () => {
  const plugin = JSONSchemaUnifiedPlugin({
    getSystem: () => ({
      getSystem: null,
      getComponent: () => null,
      getConfigs: () => ({}),
    }),
    fn: {},
  })

  it("registers its components under JSONSchemaUnified* names", () => {
    expect(Object.keys(plugin.components)).toEqual(
      expect.arrayContaining([
        "JSONSchemaUnified",
        "JSONSchemaUnifiedAccordion",
        "JSONSchemaUnifiedExpandDeepButton",
        "JSONSchemaUnifiedChevronRightIcon",
        "JSONSchemaUnifiedJSONViewer",
        "JSONSchemaUnifiedKeyword$schema",
        "JSONSchemaUnifiedKeyword$vocabulary",
        "JSONSchemaUnifiedKeyword$ref",
        "JSONSchemaUnifiedKeyword$defs",
        "JSONSchemaUnifiedKeywordAllOf",
        "JSONSchemaUnifiedKeywordProperties",
        "JSONSchemaUnifiedKeywordPatternProperties",
        "JSONSchemaUnifiedKeywordUnevaluatedProperties",
        "JSONSchemaUnifiedKeywordType",
        "JSONSchemaUnifiedKeywordEnum",
        "JSONSchemaUnifiedKeywordConst",
        "JSONSchemaUnifiedKeywordConstraint",
        "JSONSchemaUnifiedKeywordDependentRequired",
        "JSONSchemaUnifiedKeywordContentSchema",
        "JSONSchemaUnifiedKeywordTitle",
        "JSONSchemaUnifiedKeywordDescription",
        "JSONSchemaUnifiedKeywordDefault",
        "JSONSchemaUnifiedKeywordDeprecated",
        "JSONSchemaUnifiedKeywordReadOnly",
        "JSONSchemaUnifiedKeywordWriteOnly",
        "JSONSchemaUnifiedKeywordExamples",
        "JSONSchemaUnifiedExtensionKeywords",
        "withJSONSchemaUnifiedContext",
        "withJSONSchemaUnifiedSystemContext",
      ])
    )
    expect(
      Object.keys(plugin.components).filter(
        (name) => !/^(JSONSchemaUnified|withJSONSchemaUnified)/.test(name)
      )
    ).toEqual([])
  })

  it("exposes its helpers under fn.jsonSchemaUnified only", () => {
    expect(Object.keys(plugin.fn)).toEqual(["jsonSchemaUnified"])
    expect(Object.keys(plugin.fn.jsonSchemaUnified)).toEqual(
      expect.arrayContaining([
        "getTitle",
        "getType",
        "isExpandable",
        "useFn",
        "useConfig",
        "useComponent",
        "useIsExpanded",
        "usePath",
        "useLevel",
      ])
    )
  })

  it("wraps only Model and Models (its render-time gated views)", () => {
    expect(Object.keys(plugin.wrapComponents)).toEqual(["Model", "Models"])
    expect(plugin.components).toHaveProperty("JSONSchemaUnifiedModel")
    expect(plugin.components).toHaveProperty("JSONSchemaUnifiedModels")
  })
})
