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
import KeywordDependentRequired from "core/plugins/json-schema-2020-12/components/keywords/DependentRequired/DependentRequired"
import {
  getSchemaKeywords,
  makeGetTitle,
  upperFirst,
} from "core/plugins/json-schema-2020-12/fn"
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
  JSONSchema202012KeywordDependentRequired: KeywordDependentRequired,
  JSONSchema202012PathContext: () => JSONSchemaPathContext,
  JSONSchema202012LevelContext: () => JSONSchemaLevelContext,
}
const getSystem = () =>
  ({
    fn: {
      jsonSchema202012: {
        getSchemaKeywords,
        getTitle: makeGetTitle(() => ({ upperFirst })),
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
      "KeywordDependentRequired",
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

    it("exposes whether the list is expanded", () => {
      const wrapper = render({
        type: "string",
        definitions: { Slug: { type: "string" } },
      })
      const toggle = () =>
        wrapper.find(".json-schema-2020-12-keyword--definitions button").first()

      // expanded by `defaultExpandedLevels`
      expect(toggle().prop("aria-expanded")).toBe(true)
      toggle().simulate("click")
      expect(toggle().prop("aria-expanded")).toBe(false)
      toggle().simulate("click")
      expect(toggle().prop("aria-expanded")).toBe(true)
    })

    it("labels a definition with an empty name that has no title", () => {
      const root = render({
        definitions: { "": { type: "object", properties: { a: {} } } },
      }).getDOMNode()
      const entry = root.querySelector(
        ".json-schema-2020-12-keyword--definitions .json-schema-2020-12-property"
      )

      expect(
        entry?.querySelector(".json-schema-2020-12__title")?.textContent
      ).toBe("(empty name)")
      expect(
        entry?.querySelector(".json-schema-2020-12-accordion")?.textContent
      ).toContain("(empty name)")
    })

    it("keeps the title of a definition with an empty name", () => {
      const root = render({
        definitions: { "": { title: "Root", type: "object" } },
      }).getDOMNode()

      expect(
        titles(root.querySelector(".json-schema-2020-12-keyword--definitions"))
      ).toEqual(["Root"])
    })

    it("keeps the expansion of an empty name apart from a definition named like its label", () => {
      const wrapper = render({
        definitions: {
          "": { type: "object", properties: { a: {} } },
          "(empty name)": { type: "object", properties: { b: {} } },
        },
      })
      // the toggle of the keyword itself comes first, then one per definition
      const toggles = () =>
        wrapper
          .find(
            ".json-schema-2020-12-keyword--definitions button.json-schema-2020-12-accordion"
          )
          .slice(1)
      const expanded = () =>
        toggles().map((toggle) => toggle.prop("aria-expanded"))

      expect(expanded()).toEqual([true, true])
      toggles().at(0).simulate("click")
      expect(expanded()).toEqual([false, true])
    })

    it("labels a definition whose name or title is only whitespace", () => {
      const root = render({
        definitions: {
          " ": { type: "object", properties: { a: {} } },
          "": { title: " ", type: "object", properties: { b: {} } },
          "\t": { title: "Tabbed", type: "object" },
        },
      }).getDOMNode()

      expect(
        titles(root.querySelector(".json-schema-2020-12-keyword--definitions"))
      ).toEqual(["(blank name: U+0020)", "(empty name)", "Tabbed"])
    })

    it("shows a definition named like the label of the empty name apart from it", () => {
      const root = render({
        definitions: {
          "": { type: "object", properties: { a: {} } },
          "(empty name)": { type: "object", properties: { a: {} } },
        },
      }).getDOMNode()

      expect(
        titles(root.querySelector(".json-schema-2020-12-keyword--definitions"))
      ).toEqual(["(empty name)", '"(empty name)"'])
    })

    it("keeps the expansion of a definition apart from one whose $id is its name", () => {
      const schema = {
        definitions: {
          first: { $id: "second", type: "object", properties: { a: {} } },
          second: { type: "object", properties: { b: {} } },
        },
      }
      const wrapper = render(schema)
      const toggles = () =>
        wrapper
          .find(
            ".json-schema-2020-12-keyword--definitions button.json-schema-2020-12-accordion"
          )
          .slice(1)
      const expanded = () =>
        toggles().map((toggle) => toggle.prop("aria-expanded"))

      expect(expanded()).toEqual([true, true])
      toggles().at(0).simulate("click")
      // the expansion state is shared by the entries that have one token, and only
      // the clicked entry re-renders: render everything again to see it
      wrapper.setProps({ schema: { ...schema } })
      expect(expanded()).toEqual([false, true])
    })

    it("mounts no hooks for a schema without definitions", () => {
      const useIsExpandedSpy = jest.fn(useIsExpanded)
      const system = getSystem()
      system.fn.jsonSchema202012.useIsExpanded = useIsExpandedSpy
      const Keyword = makeJSONSchema202012Overrides(() => system).components
        .Keyword$defs as unknown as Component
      const Instance = withJSONSchemaContext(Keyword as never, {
        config: { defaultExpandedLevels: 5 },
      }) as Component

      mount(<Instance schema={{ type: "string", definitions: {} }} />)

      expect(useIsExpandedSpy).not.toHaveBeenCalled()
    })

    it("offers no expand button for an empty or malformed value", () => {
      for (const definitions of [{}, [], "Product"]) {
        const root = render({ type: "string", definitions }).getDOMNode()

        expect(
          root.querySelectorAll(".json-schema-2020-12-accordion")
        ).toHaveLength(0)
      }
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

    it("mounts no hooks for a schema without a schema entry", () => {
      const useIsExpandedSpy = jest.fn(useIsExpanded)
      const system = getSystem()
      system.fn.jsonSchema202012.useIsExpanded = useIsExpandedSpy
      const Keyword = makeJSONSchema202012Overrides(() => system).components
        .KeywordDependentSchemas as unknown as Component
      const Instance = withJSONSchemaContext(Keyword as never, {
        config: { defaultExpandedLevels: 5 },
      }) as Component

      for (const dependencies of [{}, { a: ["b"] }, [], "a", null]) {
        mount(<Instance schema={{ type: "object", dependencies }} />)
      }

      expect(useIsExpandedSpy).not.toHaveBeenCalled()
    })

    it("labels an entry with a blank name, whatever its title", () => {
      const root = render({
        dependencies: {
          "": { required: ["a"] },
          " ": { title: "Gift", required: ["b"] },
          "\t": { title: " ", required: ["c"] },
          giftWrap: { title: "Gift", required: ["d"] },
        },
      }).getDOMNode()

      // the name triggers the dependency, so it shows, as a name does before a title
      expect(
        titles(root.querySelector(".json-schema-2020-12-keyword--dependencies"))
      ).toEqual([
        "(empty name)",
        "(blank name: U+0020)",
        "(blank name: U+0009)",
        "giftWrap",
      ])
    })

    it("keeps the expansion of an entry apart from one whose $id is its name", () => {
      const schema = {
        dependencies: {
          first: { $id: "second", type: "object", properties: { a: {} } },
          second: { type: "object", properties: { b: {} } },
        },
      }
      const wrapper = render(schema)
      const toggles = () =>
        wrapper
          .find(
            ".json-schema-2020-12-keyword--dependencies button.json-schema-2020-12-accordion"
          )
          .slice(1)
      const expanded = () =>
        toggles().map((toggle) => toggle.prop("aria-expanded"))

      expect(expanded()).toEqual([true, true])
      toggles().at(0).simulate("click")
      // the expansion state is shared by the entries that have one token, and only
      // the clicked entry re-renders: render everything again to see it
      wrapper.setProps({ schema: { ...schema } })
      expect(expanded()).toEqual([false, true])
    })

    it("lists each blank property name that makes another required", () => {
      const root = render({
        type: "object",
        properties: { b: { type: "string" } },
        dependencies: { "": ["b"], " ": ["b"], "(empty name)": ["b"] },
        dependentRequired: { "\t": ["b"], "\u00a0\u00a0": ["b"] },
      }).getDOMNode()
      const items = Array.from(
        root.querySelectorAll(
          ".json-schema-2020-12-keyword--dependentRequired li"
        )
      ).map((item) => item.textContent)

      // `dependentRequired` first; every trigger on its own, whitespace spelled out,
      // and a property named like the label of "" quoted
      expect(items).toEqual([
        "(blank name: U+0009)",
        "(blank name: U+00A0 U+00A0)",
        "(empty name)",
        "(blank name: U+0020)",
        '"(empty name)"',
      ])
    })

    it("shows the empty name the same in every list, apart from a name like its label", () => {
      const root = render({
        type: "object",
        properties: { b: {}, c: {} },
        dependencies: {
          "": ["b", "c"],
          "(empty name)": ["b"],
          '"(empty name)"': ["b"],
        },
      }).getDOMNode()
      const lists = Array.from(
        root.querySelectorAll(
          ":scope > .json-schema-2020-12-body > .json-schema-2020-12-keyword--properties > ul > li"
        )
      ).map((li) => [
        li.querySelector(".json-schema-2020-12__title")?.textContent,
        Array.from(
          li.querySelectorAll(
            ".json-schema-2020-12-keyword--dependentRequired li"
          )
        ).map((item) => item.textContent),
      ])

      expect(lists).toEqual([
        ["b", ["(empty name)", '"(empty name)"', '"\\"(empty name)\\""']],
        ["c", ["(empty name)"]],
      ])
    })

    it("shows an entry named like the label of the empty name apart from it", () => {
      const root = render({
        dependencies: {
          "": { required: ["a"] },
          "(empty name)": { required: ["b"] },
        },
      }).getDOMNode()

      expect(
        titles(root.querySelector(".json-schema-2020-12-keyword--dependencies"))
      ).toEqual(["(empty name)", '"(empty name)"'])
    })

    it("lists them with the component the system has registered", () => {
      const Custom = ({
        dependentRequired,
      }: {
        dependentRequired: string[]
      }) =>
        dependentRequired.length === 0 ? null : (
          <ol className="custom-required">
            {dependentRequired.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ol>
        )
      const registered =
        systemComponents.JSONSchema202012KeywordDependentRequired
      systemComponents.JSONSchema202012KeywordDependentRequired = Custom

      try {
        const root = render({
          type: "object",
          properties: { b: { type: "string" }, c: { type: "string" } },
          dependencies: { "": ["b"], a: ["b"] },
        }).getDOMNode()
        const lists = Array.from(root.querySelectorAll(".custom-required")).map(
          (list) =>
            Array.from(list.querySelectorAll("li")).map((i) => i.textContent)
        )

        expect(lists).toEqual([["(empty name)", "a"]])
        expect(
          root.querySelector(".json-schema-2020-12-keyword--dependentRequired")
        ).toBeNull()
      } finally {
        systemComponents.JSONSchema202012KeywordDependentRequired = registered
      }
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
