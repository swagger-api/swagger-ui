/**
 * @prettier
 */
import React from "react"
import { mount } from "enzyme"

import { withJSONSchemaContext } from "core/plugins/json-schema-2020-12/hoc"
import JSONSchema from "core/plugins/json-schema-2020-12/components/JSONSchema/JSONSchema"
import Keyword$defs from "core/plugins/json-schema-2020-12/components/keywords/$defs"
import Keyword$dynamicAnchor from "core/plugins/json-schema-2020-12/components/keywords/$dynamicAnchor"
import Keyword$dynamicRef from "core/plugins/json-schema-2020-12/components/keywords/$dynamicRef"
import KeywordDependentSchemas from "core/plugins/json-schema-2020-12/components/keywords/DependentSchemas"
import { getSchemaKeywords } from "core/plugins/json-schema-2020-12/fn"
import {
  useComponent,
  useFn,
  useIsExpanded,
  useLevel,
  usePath,
} from "core/plugins/json-schema-2020-12/hooks"
import {
  JSONSchemaLevelContext,
  JSONSchemaPathContext,
} from "core/plugins/json-schema-2020-12/context"
import { makeJSONSchema202012Overrides } from "core/plugins/json-schema-document/overrides"
import type { OverridesSystem } from "core/plugins/json-schema-document/overrides"

type Component = React.ComponentType<Record<string, unknown>>

// the parts of the system the overrides take, as the json-schema-2020-12 plugin registers them
const systemComponents: Record<string, unknown> = {
  JSONSchema202012Keyword$defs: Keyword$defs,
  JSONSchema202012Keyword$dynamicAnchor: Keyword$dynamicAnchor,
  JSONSchema202012Keyword$dynamicRef: Keyword$dynamicRef,
  JSONSchema202012KeywordDependentSchemas: KeywordDependentSchemas,
  JSONSchema202012PathContext: () => JSONSchemaPathContext,
  JSONSchema202012LevelContext: () => JSONSchemaLevelContext,
}
const getSystem = () =>
  ({
    fn: {
      jsonSchema202012: {
        getSchemaKeywords,
        useFn,
        useComponent,
        useIsExpanded,
        usePath,
        useLevel,
      },
    },
    getComponent: (name: string) => systemComponents[name],
  }) as unknown as OverridesSystem

const render = (schema: Record<string, unknown>) => {
  const overrides = makeJSONSchema202012Overrides(getSystem)
  const Instance = withJSONSchemaContext(JSONSchema, {
    ...overrides,
    config: { defaultExpandedLevels: 5, showExtensionKeywords: true },
  }) as Component

  return mount(<Instance schema={schema} />)
}

// the head titles of the subschemas a keyword lists
const titles = (keyword: Element | null) =>
  Array.from(
    keyword?.querySelectorAll(
      ":scope > .json-schema-2020-12-keyword__children > .json-schema-2020-12-property > .json-schema-2020-12 > .json-schema-2020-12-head .json-schema-2020-12__title"
    ) ?? []
  ).map((title) => title.textContent)

describe("json-schema-document renderer overrides", () => {
  it("passes no OpenAPI fn and no config", () => {
    const overrides = makeJSONSchema202012Overrides(getSystem)

    expect(Object.keys(overrides).sort()).toEqual(["components", "fn"])
    expect(Object.keys(overrides.fn).sort()).toEqual([
      "getDependentRequired",
      "getSchemaKeywords",
      "isExpandable",
    ])
    expect(Object.keys(overrides.components)).toEqual([
      "Keyword$dynamicAnchor",
      "Keyword$dynamicRef",
      "Keyword$defs",
      "KeywordDependentSchemas",
    ])
    expect(overrides.fn.getSchemaKeywords()).toEqual([
      ...getSchemaKeywords(),
      "definitions",
      "dependencies",
      "$recursiveAnchor",
      "$recursiveRef",
      "$$ref",
    ])
  })

  describe("definitions", () => {
    const schema = {
      title: "Catalog",
      $defs: { Currency: { type: "string" } },
      definitions: {
        Product: { type: "object" },
        Price: { type: "number" },
      },
    }

    it("renders like $defs, right after it", () => {
      const root = render(schema).getDOMNode()
      const keywords = Array.from(
        root.querySelector(":scope > .json-schema-2020-12-body").children
      )
        .map((child) => child.className)
        .filter((className) =>
          /json-schema-2020-12-keyword--(\$defs|definitions)\b/.test(className)
        )
      const definitions = root.querySelector(
        ".json-schema-2020-12-keyword--definitions"
      )

      expect(keywords).toEqual([
        "json-schema-2020-12-keyword json-schema-2020-12-keyword--$defs",
        "json-schema-2020-12-keyword json-schema-2020-12-keyword--definitions",
      ])
      expect(
        definitions.querySelector(".json-schema-2020-12-keyword__name")
          .textContent
      ).toBe("definitions")
      expect(
        definitions.querySelector(".json-schema-2020-12__attribute").textContent
      ).toBe("object")
      expect(titles(definitions)).toEqual(["Product", "Price"])
    })

    it("isn't an extension keyword", () => {
      const wrapper = render(schema)

      expect(
        wrapper.find(".json-schema-2020-12-keyword--extension-keywords")
      ).toHaveLength(0)
    })

    it("makes a schema expandable when nothing else would", () => {
      const root = render({
        type: "string",
        definitions: { Slug: { type: "string" } },
      }).getDOMNode()

      expect(
        root.querySelectorAll(
          ":scope > .json-schema-2020-12-head .json-schema-2020-12-accordion"
        )
      ).toHaveLength(1)
      expect(
        titles(root.querySelector(".json-schema-2020-12-keyword--definitions"))
      ).toEqual(["Slug"])
    })

    it("renders nothing for an empty or malformed value", () => {
      for (const definitions of [{}, [], "Product", null]) {
        const wrapper = render({ title: "T", definitions })

        expect(
          wrapper.find(".json-schema-2020-12-keyword--definitions")
        ).toHaveLength(0)
      }
    })
  })
  describe("dependencies", () => {
    const schema = {
      title: "Order",
      properties: {
        name: { type: "string" },
        creditCard: { type: "string" },
        billingAddress: { type: "string" },
      },
      dependencies: {
        creditCard: ["billingAddress"],
        giftWrap: { required: ["giftMessage"], title: "Gift" },
      },
      dependentRequired: { name: ["billingAddress"] },
      dependentSchemas: { name: { title: "Named" } },
    }

    it("renders the schema entries like dependentSchemas, right after it", () => {
      const root = render(schema).getDOMNode()
      const keywords = Array.from(
        root.querySelector(":scope > .json-schema-2020-12-body").children
      )
        .map((child) => child.className)
        .filter((className) =>
          /json-schema-2020-12-keyword--(dependentSchemas|dependencies)\b/.test(
            className
          )
        )
      const dependencies = root.querySelector(
        ".json-schema-2020-12-keyword--dependencies"
      )

      expect(keywords).toEqual([
        "json-schema-2020-12-keyword json-schema-2020-12-keyword--dependentSchemas",
        "json-schema-2020-12-keyword json-schema-2020-12-keyword--dependencies",
      ])
      expect(
        dependencies.querySelector(".json-schema-2020-12-keyword__name")
          .textContent
      ).toBe("Dependencies")
      expect(titles(dependencies)).toEqual(["giftWrap"])
    })

    it("renders the array entries like dependentRequired", () => {
      const root = render(schema).getDOMNode()
      const required = Array.from(
        root.querySelectorAll(".json-schema-2020-12-property")
      ).map((property) => [
        property.querySelector(".json-schema-2020-12__title").textContent,
        Array.from(
          property.querySelectorAll(
            ":scope > .json-schema-2020-12 > .json-schema-2020-12-body > .json-schema-2020-12-keyword--dependentRequired li"
          )
        ).map((item) => item.textContent),
      ])

      expect(required).toEqual(
        expect.arrayContaining([
          ["name", []],
          ["creditCard", []],
          ["billingAddress", ["name", "creditCard"]],
        ])
      )
    })

    it("isn't an extension keyword", () => {
      const wrapper = render(schema)

      expect(
        wrapper.find(".json-schema-2020-12-keyword--extension-keywords")
      ).toHaveLength(0)
    })

    it("makes a schema expandable only with a schema entry", () => {
      const withSchema = render({
        type: "object",
        dependencies: { express: { required: ["carrier"] } },
      }).getDOMNode()
      const withArray = render({
        type: "object",
        dependencies: { express: ["carrier"] },
      }).getDOMNode()

      expect(
        withSchema.querySelectorAll(
          ":scope > .json-schema-2020-12-head .json-schema-2020-12-accordion"
        )
      ).toHaveLength(1)
      expect(
        titles(
          withSchema.querySelector(".json-schema-2020-12-keyword--dependencies")
        )
      ).toEqual(["express"])
      expect(
        withArray.querySelectorAll(
          ":scope > .json-schema-2020-12-head .json-schema-2020-12-accordion"
        )
      ).toHaveLength(0)
      expect(
        withArray.querySelector(".json-schema-2020-12-keyword--dependencies")
      ).toBeNull()
    })
  })
  describe("$recursiveAnchor and $recursiveRef", () => {
    // the body keywords of a schema, in order
    const bodyKeywords = (root: Element) =>
      Array.from(
        root.querySelector(":scope > .json-schema-2020-12-body").children
      ).map((child) =>
        child.className.replace(
          /^json-schema-2020-12-keyword json-schema-2020-12-keyword--/,
          ""
        )
      )
    const value = (root: Element, keyword: string) =>
      root.querySelector(
        `:scope > .json-schema-2020-12-body > .json-schema-2020-12-keyword--${keyword.replace(/\$/g, "\\$")} .json-schema-2020-12-keyword__value`
      ).textContent

    it("renders them as written, right after $dynamicAnchor and $dynamicRef", () => {
      const root = render({
        title: "Tree",
        $dynamicAnchor: "node",
        $recursiveAnchor: "node",
        $dynamicRef: "#node",
        $recursiveRef: "#",
      }).getDOMNode()

      expect(bodyKeywords(root)).toEqual([
        "$dynamicAnchor",
        "$recursiveAnchor",
        "$dynamicRef",
        "$recursiveRef",
      ])
      expect(value(root, "$recursiveAnchor")).toBe("node")
      expect(value(root, "$recursiveRef")).toBe("#")
    })

    it("shows 2019-09's boolean $recursiveAnchor as written", () => {
      for (const anchor of [true, false]) {
        const root = render({
          title: "T",
          $recursiveAnchor: anchor,
        }).getDOMNode()

        expect(value(root, "$recursiveAnchor")).toBe(String(anchor))
      }
    })

    it("aren't extension keywords and make a schema expandable", () => {
      const wrapper = render({
        type: "object",
        properties: { child: { $recursiveRef: "#" } },
      })
      const child = wrapper
        .getDOMNode()
        .querySelector(".json-schema-2020-12-property > .json-schema-2020-12")

      expect(
        wrapper.find(".json-schema-2020-12-keyword--extension-keywords")
      ).toHaveLength(0)
      expect(
        child.querySelectorAll(
          ":scope > .json-schema-2020-12-head .json-schema-2020-12-accordion"
        )
      ).toHaveLength(1)
      expect(value(child, "$recursiveRef")).toBe("#")
    })
  })
})
