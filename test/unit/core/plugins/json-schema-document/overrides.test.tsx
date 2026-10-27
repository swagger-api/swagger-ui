/**
 * @prettier
 */
import React from "react"
import { mount } from "enzyme"

import { withJSONSchemaContext } from "core/plugins/json-schema-2020-12/hoc"
import JSONSchema from "core/plugins/json-schema-2020-12/components/JSONSchema/JSONSchema"
import Keyword$defs from "core/plugins/json-schema-2020-12/components/keywords/$defs"
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
      "getSchemaKeywords",
      "isExpandable",
    ])
    expect(Object.keys(overrides.components)).toEqual(["Keyword$defs"])
    expect(overrides.fn.getSchemaKeywords()).toEqual([
      ...getSchemaKeywords(),
      "definitions",
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
})
