/**
 * @prettier
 */
import React from "react"
import { mount } from "enzyme"
import { fromJS } from "immutable"

import Markdown from "core/components/providers/markdown"
import JSONSchema from "core/plugins/json-schema-unified/components/JSONSchema/JSONSchema"
import { withJSONSchemaContext } from "core/plugins/json-schema-unified/hoc"
import {
  getOASDialectOverrides,
  OAS_DIALECT_SCHEMAS,
} from "core/plugins/json-schema-unified/dialects"
import type {
  OASDialect,
  OASDialectOptions,
} from "core/plugins/json-schema-unified/dialects"
import {
  getLocalRefName,
  getRefSchemaName,
  makeLegacyDialectFn,
  mergeLazyRef,
  stringifyLegacyConstraints,
  OAS30_SCHEMA_KEYWORDS,
  SWAGGER2_SCHEMA_KEYWORDS,
} from "core/plugins/json-schema-unified/legacy"
import { findSchemaDefinition } from "core/plugins/json-schema-unified/schemas"
import type {
  JSONSchemaConfig,
  Schema,
} from "core/plugins/json-schema-unified/types"

const render = (
  schema: unknown,
  {
    dialect = "oas30",
    options = {},
    config = {},
    name = "",
  }: {
    dialect?: OASDialect
    options?: OASDialectOptions
    config?: Partial<JSONSchemaConfig>
    name?: string
  } = {}
) => {
  const overrides = getOASDialectOverrides(dialect, {
    includeReadOnly: true,
    includeWriteOnly: true,
    ...options,
  })
  const JSONSchemaUnified = withJSONSchemaContext(JSONSchema, {
    config: { ...overrides.config, ...config },
    fn: overrides.fn,
    components: { ...overrides.components, Markdown },
  })
  return mount(<JSONSchemaUnified schema={schema} name={name} />)
}

/** Renders a schema and expands it deeply ("Expand all" of the root). */
const renderExpanded = (...args: Parameters<typeof render>): HTMLElement => {
  const wrapper = render(...args)
  wrapper.find("button").at(1).simulate("click")
  wrapper.update()
  return wrapper.getDOMNode()
}

const keyword = (root: Element, name: string) =>
  root.querySelector(`[data-keyword="${name}"]`)

/** The head (first child) of a schema's root element. */
const head = (schema: Element) => schema.firstElementChild

const typeOf = (schema: Element) =>
  head(schema).querySelector('[data-keyword="type"]').textContent

const constraintsOf = (schema: Element) =>
  Array.from(head(schema).querySelectorAll('[data-keyword="constraint"]')).map(
    (element) => element.textContent
  )

const property = (root: Element, name: string) =>
  root.querySelector(
    `[data-keyword="properties"] [data-json-schema-unified][data-schema-name="${name}"]`
  )

const toggle = (schema: Element) =>
  head(schema).querySelector("button[data-expanded]") as HTMLButtonElement

const LEGACY = ["swagger2", "oas30"] as const

describe("json-schema-unified OAS 2.0 / 3.0 dialects", () => {
  describe("overrides", () => {
    it.each(LEGACY)("claims no dialect id for %s", (dialect) => {
      expect(OAS_DIALECT_SCHEMAS[dialect]).toBeUndefined()
      const { config } = getOASDialectOverrides(dialect)
      expect(Object.hasOwn(config, "default$schema")).toBe(true)
      expect(config.default$schema).toBeUndefined()
    })

    it("replaces the slots of keywords 2.0 lacks", () => {
      const swagger2 = getOASDialectOverrides("swagger2").components
      const oas30 = getOASDialectOverrides("oas30").components

      for (const name of [
        "KeywordConst",
        "Keyword$defs",
        "KeywordPrefixItems",
        "KeywordIf",
      ]) {
        expect(swagger2[name]).toBeDefined()
        expect(oas30[name]).toBe(swagger2[name])
      }
      for (const name of ["KeywordOneOf", "KeywordAnyOf", "KeywordNot"]) {
        expect(swagger2[name]).toBeDefined()
        expect(oas30[name]).toBeUndefined()
      }
      expect(swagger2.KeywordDiscriminator).toBeDefined()
      expect(oas30.KeywordDiscriminator).toBeUndefined()
    })
  })

  describe("keyword lists", () => {
    const only2020 = [
      "const",
      "$defs",
      "$anchor",
      "$id",
      "$schema",
      "prefixItems",
      "if",
      "then",
      "else",
      "dependentSchemas",
      "dependentRequired",
      "unevaluatedItems",
      "unevaluatedProperties",
      "patternProperties",
      "propertyNames",
      "contains",
      "examples",
    ]

    it.each(LEGACY)("%s has no 2020-12-only keyword", (dialect) => {
      const keywords = makeLegacyDialectFn(dialect).getSchemaKeywords()
      for (const name of only2020) expect(keywords).not.toContain(name)
      expect(keywords).toEqual(
        expect.arrayContaining([
          "$ref",
          "$$ref",
          "items",
          "allOf",
          "example",
          "xml",
          "externalDocs",
          "readOnly",
          "discriminator",
          "exclusiveMaximum",
          "exclusiveMinimum",
        ])
      )
    })

    it("lists the 3.0-only keywords for 3.0 only", () => {
      for (const name of [
        "nullable",
        "writeOnly",
        "deprecated",
        "oneOf",
        "anyOf",
        "not",
      ]) {
        expect(OAS30_SCHEMA_KEYWORDS).toContain(name)
        expect(SWAGGER2_SCHEMA_KEYWORDS).not.toContain(name)
      }
    })

    it.each(LEGACY)(
      "%s shows 2020-12-only keywords as extension keywords",
      (dialect) => {
        const root = renderExpanded(
          {
            type: "string",
            const: "pet",
            examples: ["a"],
            $defs: { A: { type: "string" } },
          },
          { dialect, config: { showExtensionKeywords: true } }
        )

        expect(keyword(root, "const")).toBeNull()
        expect(keyword(root, "examples")).toBeNull()
        expect(keyword(root, "$defs")).toBeNull()
        const extensions = keyword(root, "extensionKeywords").textContent
        expect(extensions).toContain("const")
        expect(extensions).toContain("examples")
        expect(extensions).toContain("$defs")
      }
    )

    it.each(LEGACY)("%s renders example, xml and externalDocs", (dialect) => {
      const root = renderExpanded(
        {
          type: "object",
          example: { a: 1 },
          xml: { name: "pet" },
          externalDocs: { url: "https://example.com" },
          "x-ext": 1,
        },
        { dialect, options: { showExtensions: false } }
      )

      expect(keyword(root, "example")).not.toBeNull()
      expect(keyword(root, "xml")).not.toBeNull()
      expect(keyword(root, "externalDocs")).not.toBeNull()
      expect(keyword(root, "extensionKeywords")).toBeNull()
    })
  })

  describe("boolean exclusive bounds", () => {
    it.each([
      [{ maximum: 10, exclusiveMaximum: true }, ["< 10"]],
      [{ maximum: 10, exclusiveMaximum: false }, ["≤ 10"]],
      [{ minimum: 1, exclusiveMinimum: true }, ["> 1"]],
      [{ minimum: 1 }, ["≥ 1"]],
      [{ minimum: 1, exclusiveMinimum: true, maximum: 10 }, ["(1, 10]"]],
      [
        { minimum: 1, maximum: 10, exclusiveMaximum: true, multipleOf: 2 },
        ["multiple of 2", "[1, 10)"],
      ],
      // a 2020-12 numeric bound has no meaning in these dialects
      [{ exclusiveMaximum: 5 }, []],
    ])("formats %j", (bounds, expected) => {
      const values = (schema: Schema) =>
        stringifyLegacyConstraints(schema).map(({ value }) => value)

      expect(values({ type: "number", ...bounds })).toEqual(expected)
      for (const dialect of LEGACY) {
        expect(
          constraintsOf(
            render({ type: "number", ...bounds }, { dialect }).getDOMNode()
          )
        ).toEqual(expected)
      }
    })

    it("drops constraint keywords the dialects lack", () => {
      expect(
        stringifyLegacyConstraints({
          type: "string",
          contentMediaType: "text/plain",
          minLength: 1,
        }).map(({ value }) => value)
      ).toEqual(["≥ 1 characters"])
    })
  })

  describe("types", () => {
    it("shows 3.0 nullable as a null union", () => {
      const nullable = render({ type: "string", nullable: true }).getDOMNode()
      const nullableArray = render({
        type: "array",
        items: { type: "integer", nullable: true },
      }).getDOMNode()

      expect(typeOf(nullable)).toBe("string | null")
      expect(typeOf(nullableArray)).toBe("array<integer | null>")
      expect(
        typeOf(render({ nullable: true, description: "x" }).getDOMNode())
      ).toBe("any")
    })

    it("does not know nullable in 2.0", () => {
      const root = render(
        { type: "string", nullable: true },
        { dialect: "swagger2" }
      ).getDOMNode()

      expect(typeOf(root)).toBe("string")
    })

    it("renders type file in 2.0 only", () => {
      expect(
        typeOf(render({ type: "file" }, { dialect: "swagger2" }).getDOMNode())
      ).toBe("file")
      expect(typeOf(render({ type: "file" }).getDOMNode())).toBe("any")
    })

    it("combines allOf, and oneOf/anyOf in 3.0 only", () => {
      const schema = {
        allOf: [{ type: "object" }],
        oneOf: [{ type: "string" }, { type: "integer" }],
        anyOf: [{ type: "boolean" }],
      }
      const oas30 = renderExpanded(schema)
      const swagger2 = renderExpanded(schema, { dialect: "swagger2" })

      expect(typeOf(oas30)).toBe("(string | integer) | (boolean) | (object)")
      expect(keyword(oas30, "oneOf")).not.toBeNull()
      expect(keyword(oas30, "anyOf")).not.toBeNull()

      expect(typeOf(swagger2)).toBe("(object)")
      expect(keyword(swagger2, "allOf")).not.toBeNull()
      expect(keyword(swagger2, "oneOf")).toBeNull()
      expect(keyword(swagger2, "anyOf")).toBeNull()
    })

    it("renders not, deprecated and writeOnly in 3.0 only", () => {
      const schema = {
        type: "object",
        not: { type: "string" },
        deprecated: true,
        writeOnly: true,
      }
      const oas30 = renderExpanded(schema)
      const swagger2 = renderExpanded(schema, { dialect: "swagger2" })

      for (const name of ["not", "deprecated", "writeOnly"]) {
        expect(keyword(oas30, name)).not.toBeNull()
        expect(keyword(swagger2, name)).toBeNull()
      }
    })
  })

  describe("discriminator", () => {
    it("is a property-name string in 2.0", () => {
      const root = renderExpanded(
        { type: "object", discriminator: "petType" },
        { dialect: "swagger2" }
      )
      const discriminator = keyword(root, "discriminator")

      expect(discriminator.textContent).toBe("DiscriminatorpetType")
      expect(discriminator.hasAttribute("data-expanded")).toBe(false)
      expect(
        keyword(
          renderExpanded(
            { type: "object", discriminator: { propertyName: "petType" } },
            { dialect: "swagger2" }
          ),
          "discriminator"
        )
      ).toBeNull()
    })

    it("is an object with propertyName and mapping in 3.0", () => {
      const root = renderExpanded({
        type: "object",
        discriminator: {
          propertyName: "petType",
          mapping: { dog: "#/components/schemas/Dog" },
        },
      })
      const discriminator = keyword(root, "discriminator")

      expect(discriminator.textContent).toContain("petType")
      expect(discriminator.textContent).toContain("dog#/components/schemas/Dog")
      expect(
        keyword(renderExpanded({ discriminator: "petType" }), "discriminator")
      ).toBeNull()
    })
  })

  describe("readOnly / writeOnly properties", () => {
    const schema = {
      type: "object",
      properties: {
        plain: { type: "string" },
        ro: { type: "string", readOnly: true },
        wo: { type: "string", writeOnly: true },
      },
    }
    const names = (root: Element) =>
      Array.from(
        root.querySelectorAll(
          '[data-keyword="properties"] > ul > li > [data-json-schema-unified]'
        )
      ).map((element) => element.getAttribute("data-schema-name"))

    it("filters both in 3.0", () => {
      expect(
        names(
          renderExpanded(schema, {
            options: { includeReadOnly: false, includeWriteOnly: true },
          })
        )
      ).toEqual(["plain", "wo"])
      expect(
        names(
          renderExpanded(schema, {
            options: { includeReadOnly: true, includeWriteOnly: false },
          })
        )
      ).toEqual(["plain", "ro"])
    })

    it("filters both in 2.0 too (writeOnly as json-schema-5 does)", () => {
      expect(
        names(
          renderExpanded(schema, {
            dialect: "swagger2",
            options: { includeReadOnly: false, includeWriteOnly: true },
          })
        )
      ).toEqual(["plain", "wo"])
      expect(
        names(
          renderExpanded(schema, {
            dialect: "swagger2",
            options: { includeReadOnly: true, includeWriteOnly: false },
          })
        )
      ).toEqual(["plain", "ro"])
    })
  })

  describe("nested schema names", () => {
    it.each([
      ["#/definitions/Category", "Category"],
      ["http://example.com/doc.yaml#/components/schemas/Pet", "Pet"],
      ["#/definitions/Foo~1Bar~0Baz", "Foo/Bar~Baz"],
      ["#/definitions/Caf%C3%A9", "Café"],
      ["#/definitions/a%2Fb", "a/b"],
      ["#/definitions/A/properties/b", "b"],
      ["#/definitions/%E0%A4%A", "%E0%A4%A"],
      ["#", ""],
      ["#/", ""],
      ["http://example.com/doc.yaml", ""],
    ])("names %s %j", (ref, name) => {
      expect(getRefSchemaName(ref)).toBe(name)
    })

    it.each(LEGACY)(
      "%s titles a schema by title, then $$ref, then $ref",
      (dialect) => {
        const { getTitle } = makeLegacyDialectFn(dialect)

        expect(getTitle({ title: "pet", $$ref: "#/definitions/X" })).toBe("Pet")
        expect(getTitle({ $$ref: "#/definitions/Foo~1Bar" })).toBe("Foo/Bar")
        expect(getTitle({ $ref: "#/components/schemas/Y" })).toBe("Y")
        expect(getTitle({ $$ref: "#" })).toBe("")
        expect(getTitle({ $anchor: "a", $id: "b" })).toBe("")
        // the Schemas section's basic lookup keeps the schema's own name
        expect(
          getTitle({ $$ref: "#/definitions/X" }, { lookup: "basic" })
        ).toBe("")
      }
    )

    const combined = {
      allOf: [
        { type: "object", $$ref: "#/components/schemas/Base" },
        { type: "object", title: "Extra", $$ref: "#/components/schemas/X" },
      ],
    }
    const memberNames = (root: Element) =>
      Array.from(
        keyword(root, "allOf").querySelectorAll(
          "li > [data-json-schema-unified]"
        )
      ).map((element) => element.getAttribute("data-schema-name"))

    it.each(LEGACY)("%s names combined members after them", (dialect) => {
      expect(memberNames(renderExpanded(combined, { dialect }))).toEqual([
        "#0 Base",
        "#1 Extra",
      ])
    })

    it("keeps the 3.1 naming (title, $anchor, $id; no $$ref)", () => {
      expect(
        memberNames(renderExpanded(combined, { dialect: "oas31" }))
      ).toEqual(["#0 ", "#1 Extra"])
    })
  })

  describe("reference path", () => {
    const schema = {
      type: "object",
      properties: {
        category: {
          type: "object",
          properties: { id: { type: "integer" } },
          $$ref: "http://example.com/doc.yaml#/definitions/Category",
        },
        external: {
          type: "object",
          properties: { id: { type: "integer" } },
          $$ref: "http://example.com/other.yaml#/definitions/Other",
        },
        plain: { type: "object", properties: { id: { type: "integer" } } },
      },
    }
    const refPath = (root: Element, name: string) =>
      head(property(root, name)).querySelector('[data-keyword="$$ref"]')

    const classes = (element: Element) =>
      element.getAttribute("class").split(" ")

    it.each(LEGACY)(
      "%s renders it as a hidden tooltip in the title, collapsed or expanded",
      (dialect) => {
        const collapsed = render(schema, {
          dialect,
          config: { defaultExpandedLevels: 1 },
          options: { getDocumentUrl: () => "http://example.com/doc.yaml" },
        }).getDOMNode()
        const tooltip = refPath(collapsed, "category")

        expect(tooltip.textContent).toBe("#/definitions/Category")
        expect(tooltip.getAttribute("role")).toBe("tooltip")
        expect(classes(tooltip)).toEqual(
          expect.arrayContaining([
            "sui:hidden",
            "sui:peer-hover/ref-title:block",
            "sui:peer-focus-visible/ref-title:block",
            "sui:absolute",
            "sui:top-[-1.8em]",
          ])
        )
        expect(
          classes(tooltip).every((token) => token.startsWith("sui:"))
        ).toBe(true)
        // a direct child of the head, after the title toggle (its only peer)
        const head = tooltip.parentElement
        expect(classes(head)).toContain("sui:relative")
        const siblings = Array.from(head.children)
        const peers = siblings.filter((child) =>
          classes(child).includes("sui:peer/ref-title")
        )
        expect(peers).toHaveLength(1)
        expect(peers[0].tagName).toBe("BUTTON")
        expect(
          peers[0].querySelector("[data-json-schema-title]")
        ).not.toBeNull()
        expect(siblings.indexOf(peers[0])).toBeLessThan(
          siblings.indexOf(tooltip)
        )

        const root = renderExpanded(schema, {
          dialect,
          options: { getDocumentUrl: () => "http://example.com/doc.yaml" },
        })
        expect(refPath(root, "category").textContent).toBe(
          "#/definitions/Category"
        )
        expect(refPath(root, "external").textContent).toBe(
          "http://example.com/other.yaml#/definitions/Other"
        )
        expect(refPath(root, "plain")).toBeNull()
      }
    )

    it.each(LEGACY)(
      "%s places a top-level schema's tooltip closer to its title",
      (dialect) => {
        const root = render(
          {
            type: "object",
            properties: { id: { type: "integer" } },
            $$ref: "http://example.com/doc.yaml#/definitions/User",
          },
          {
            dialect,
            options: { getDocumentUrl: () => "http://example.com/doc.yaml" },
          }
        ).getDOMNode()
        const tooltip = root.querySelector('[data-keyword="$$ref"]')

        expect(tooltip.textContent).toBe("#/definitions/User")
        expect(classes(tooltip)).toContain("sui:top-[-1.15em]")
        expect(classes(tooltip)).not.toContain("sui:top-[-1.8em]")
      }
    )

    it.each(["oas31", "oas32"] as const)("%s does not show it", (dialect) => {
      const root = renderExpanded(schema, { dialect })

      expect(root.querySelector('[data-keyword="$$ref"]')).toBeNull()
    })
  })

  describe("nested schema name next to the property", () => {
    const schema = {
      type: "object",
      properties: {
        category: {
          type: "object",
          properties: { id: { type: "integer" } },
          $$ref: "http://example.com/doc.yaml#/definitions/Category",
        },
        owner: {
          type: "object",
          title: "person",
          properties: { id: { type: "integer" } },
        },
        plain: { type: "object", properties: { id: { type: "integer" } } },
        tags: {
          type: "array",
          items: {
            type: "object",
            properties: { label: { type: "string" } },
            $$ref: "http://example.com/doc.yaml#/definitions/Tag",
          },
        },
      },
    }
    const schemaName = (root: Element, name: string) =>
      head(property(root, name)).querySelector('[data-keyword="schemaName"]')

    it.each(LEGACY)(
      "%s names a nested schema by its title or reference, collapsed too",
      (dialect) => {
        const root = render(schema, {
          dialect,
          config: { defaultExpandedLevels: 1 },
        }).getDOMNode()

        expect(schemaName(root, "category").textContent).toBe("Category")
        expect(schemaName(root, "owner").textContent).toBe("Person")
        expect(schemaName(root, "plain")).toBeNull()
        expect(
          schemaName(root, "category")
            .getAttribute("class")
            .split(" ")
            .every((token) => token.startsWith("sui:"))
        ).toBe(true)

        const expanded = renderExpanded(schema, { dialect })
        const itemsName = keyword(
          property(expanded, "tags"),
          "items"
        ).querySelector('[data-keyword="schemaName"]')
        expect(itemsName.textContent).toBe("Tag")
      }
    )

    it.each(["oas31", "oas32"] as const)("%s does not show it", (dialect) => {
      const root = renderExpanded(schema, { dialect })

      expect(root.querySelector('[data-keyword="schemaName"]')).toBeNull()
    })
  })

  describe("recursive models ($ref left in place by the resolver)", () => {
    const node = {
      type: "object",
      required: ["name"],
      properties: {
        name: { type: "string" },
        children: {
          type: "array",
          items: { $ref: "http://example.com/doc.yaml#/definitions/Node" },
        },
      },
    }
    const findSchema = (name: string) => (name === "Node" ? node : null)
    const children = (schema: Element) => property(schema, "children")
    const items = (schema: Element) =>
      keyword(children(schema), "items").querySelector(
        "[data-json-schema-unified]"
      )

    it("finds local references of its dialect only", () => {
      expect(getLocalRefName("#/definitions/Node", "swagger2")).toBe("Node")
      expect(getLocalRefName("x.yaml#/definitions/A~1B", "swagger2")).toBe(
        "A/B"
      )
      expect(getLocalRefName("#/components/schemas/Node", "swagger2")).toBe(
        null
      )
      expect(getLocalRefName("#/components/schemas/Node", "oas30")).toBe("Node")
      expect(getLocalRefName("#/definitions/A/properties/b", "swagger2")).toBe(
        null
      )
      expect(getLocalRefName("#/definitions/", "swagger2")).toBe(null)
    })

    it("merges the reference's siblings over the definition", () => {
      expect(
        mergeLazyRef(
          { title: "Parent", required: ["a"], properties: { a: {} } },
          {
            $ref: "#/components/schemas/Parent",
            title: "Child",
            required: ["b"],
            properties: { b: {} },
          }
        )
      ).toEqual({
        title: "Child",
        required: ["a", "b"],
        properties: { a: {}, b: {} },
        $$ref: "#/components/schemas/Parent",
      })
      expect(
        mergeLazyRef({ type: "object" }, { $ref: "#/a", $$ref: "#/b" }).$$ref
      ).toBe("#/b")
    })

    it("stays expandable level after level", () => {
      const wrapper = render(node, {
        dialect: "swagger2",
        name: "Node",
        options: { findSchema },
      })
      const root = wrapper.getDOMNode()
      const click = (element: Element) => {
        wrapper
          .find("button")
          .filterWhere((button) => button.getDOMNode() === element)
          .simulate("click")
        wrapper.update()
      }

      let level = root
      click(toggle(root))
      for (let depth = 1; depth <= 3; depth += 1) {
        click(toggle(children(level)))
        const next = items(level)
        expect(next.getAttribute("data-expanded")).toBe("false")
        expect(typeOf(next)).toBe("object")
        expect(typeOf(next)).not.toContain("circular")
        click(toggle(next))
        expect(next.getAttribute("data-expanded")).toBe("true")
        expect(property(next, "name")).not.toBeNull()
        expect(
          head(next).querySelector('[data-keyword="$$ref"]').textContent
        ).toBe("http://example.com/doc.yaml#/definitions/Node")
        level = next
      }
      expect(typeOf(children(root))).toBe("array<object>")
    })

    it("bounds Expand all at the first repeated reference", () => {
      const root = renderExpanded(node, {
        dialect: "swagger2",
        options: {
          findSchema: () => node,
          getDocumentUrl: () => "http://example.com/doc.yaml",
        },
      })
      const first = items(root)
      const second = items(first)

      expect(first.getAttribute("data-expanded")).toBe("true")
      expect(second.getAttribute("data-expanded")).toBe("false")
      expect(second.getAttribute("data-schema-name")).toBeNull()
      expect(root.querySelectorAll("[data-json-schema-unified]").length).toBe(6)
    })

    it("keeps an unresolvable reference as $ref", () => {
      const root = renderExpanded(
        { type: "object", properties: { x: { $ref: "other.yaml#/X" } } },
        { dialect: "swagger2", options: { findSchema } }
      )

      expect(keyword(property(root, "x"), "$ref").textContent).toContain(
        "other.yaml#/X"
      )
    })

    it("is not done by the 3.1 dialect", () => {
      const root = renderExpanded(
        {
          type: "object",
          properties: { next: { $ref: "#/components/schemas/Node" } },
        },
        { dialect: "oas31", options: { findSchema } }
      )

      expect(keyword(property(root, "next"), "$ref")).not.toBeNull()
      expect(keyword(property(root, "next"), "properties")).toBeNull()
    })
  })

  describe("findSchemaDefinition", () => {
    const specJson = fromJS({
      definitions: { Node: { type: "object" } },
      components: { schemas: { Pet: { type: "object" } } },
    })

    it("prefers the resolved subtree, then the raw definition", () => {
      let resolved: unknown = undefined
      const specSelectors = {
        specJson: () => specJson,
        specResolvedSubtree: () => resolved,
      }

      expect(findSchemaDefinition(specSelectors, "swagger2", "Node")).toEqual({
        type: "object",
      })
      expect(findSchemaDefinition(specSelectors, "oas30", "Pet")).toEqual({
        type: "object",
      })
      expect(findSchemaDefinition(specSelectors, "oas30", "Node")).toBeNull()

      resolved = fromJS({ type: "object", title: "Resolved" })
      expect(
        findSchemaDefinition(specSelectors, "swagger2", "Node")
      ).toHaveProperty("title", "Resolved")
    })
  })
})
