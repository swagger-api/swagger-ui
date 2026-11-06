/**
 * @prettier
 */
import React from "react"
import { mount } from "enzyme"

import Markdown from "core/components/providers/markdown"
import JSONSchemaUnifiedPlugin from "core/plugins/json-schema-unified"
import JSONSchema from "core/plugins/json-schema-unified/components/JSONSchema/JSONSchema"
import {
  withJSONSchemaContext,
  makeWithJSONSchemaSystemContext,
} from "core/plugins/json-schema-unified/hoc"
import {
  getOASDialectOverrides,
  getOASProperties,
  getOASSchemaKeywords,
  OAS_DIALECT_SCHEMAS,
} from "core/plugins/json-schema-unified/dialects"
import type {
  OASDialect,
  OASDialectOptions,
} from "core/plugins/json-schema-unified/dialects"
import type { JSONSchemaConfig } from "core/plugins/json-schema-unified/types"

const render = (
  schema: unknown,
  {
    dialect = "oas31",
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

/** Renders a schema and expands it deeply. */
const renderExpanded = (...args: Parameters<typeof render>): HTMLElement => {
  const wrapper = render(...args)
  wrapper.find("button").at(1).simulate("click") // "Expand all"
  wrapper.update()
  return wrapper.getDOMNode()
}

const keyword = (root: Element, name: string) =>
  root.querySelector(`[data-keyword="${name}"]`)

/** `data-schema-name`s of the schemas listed by a `properties` keyword. */
const propertyNames = (root: Element) =>
  Array.from(keyword(root, "properties").querySelector("ul").children).map(
    (item) => item.firstElementChild.getAttribute("data-schema-name")
  )

const classTokens = (root: Element) =>
  [root, ...Array.from(root.querySelectorAll("*"))]
    .flatMap((element) => Array.from(element.classList))
    .filter(Boolean)

const oasSchema = {
  title: "Pet",
  type: "object",
  description: "A **pet**",
  properties: { petType: { type: "string" } },
  examples: [{ petType: "dog" }],
  discriminator: {
    propertyName: "petType",
    mapping: { dog: "#/components/schemas/Dog" },
    "x-discriminator-ext": "d",
  },
  xml: {
    name: "pet",
    namespace: "https://example.com/schema",
    prefix: "ex",
    attribute: true,
    wrapped: true,
    "x-xml-ext": { flag: true },
  },
  externalDocs: {
    description: "More *docs*",
    url: "https://example.com/docs",
    "x-docs-ext": 1,
  },
  example: { petType: "cat" },
  $$ref: "#/components/schemas/Pet",
  "x-schema-ext": "s",
}

describe("json-schema-unified OAS dialects", () => {
  describe("getOASDialectOverrides", () => {
    it.each([
      ["oas31", "https://spec.openapis.org/oas/3.1/dialect/base"],
      ["oas32", "https://spec.openapis.org/oas/3.2/dialect/2025-09-17"],
    ] as const)("sets default$schema for %s", (dialect, $schema) => {
      expect(getOASDialectOverrides(dialect).config.default$schema).toBe(
        $schema
      )
      expect(OAS_DIALECT_SCHEMAS[dialect]).toBe($schema)
    })

    it("passes the runtime inputs as config", () => {
      expect(
        getOASDialectOverrides("oas32", {
          includeReadOnly: true,
          includeWriteOnly: false,
          defaultExpandedLevels: 2,
          showExtensions: true,
        }).config
      ).toEqual({
        default$schema: "https://spec.openapis.org/oas/3.2/dialect/2025-09-17",
        includeReadOnly: true,
        includeWriteOnly: false,
        defaultExpandedLevels: 2,
        showExtensionKeywords: true,
      })
    })

    it("leaves the HOC defaults alone for omitted inputs", () => {
      expect(getOASDialectOverrides("oas31").config).toEqual({
        default$schema: "https://spec.openapis.org/oas/3.1/dialect/base",
        includeReadOnly: false,
        includeWriteOnly: false,
      })
    })

    it("overrides the OAS fn and the description/examples/properties slots only", () => {
      const overrides = getOASDialectOverrides("oas31")

      expect(Object.keys(overrides.fn).sort()).toEqual([
        "getProperties",
        "getSchemaKeywords",
        "isExpandable",
      ])
      expect(Object.keys(overrides.components).sort()).toEqual([
        "KeywordDescription",
        "KeywordExamples",
        "KeywordProperties",
      ])
    })

    it("returns fresh overrides without touching the plugin's fn", () => {
      const plugin = JSONSchemaUnifiedPlugin({
        getSystem: () => ({
          getSystem: null,
          getComponent: () => null,
          getConfigs: () => ({}),
        }),
        fn: {},
      })
      const before = { ...plugin.fn.jsonSchemaUnified }
      const first = getOASDialectOverrides("oas31", { includeReadOnly: true })
      const second = getOASDialectOverrides("oas31")

      expect(first).not.toBe(second)
      expect(first.config).not.toBe(second.config)
      expect(second.config.includeReadOnly).toBe(false)
      expect(plugin.fn.jsonSchemaUnified).toEqual(before)
      expect(plugin.fn.jsonSchemaUnified.getSchemaKeywords()).not.toContain(
        "$$ref"
      )
    })

    it("rejects unknown dialects", () => {
      expect(() =>
        getOASDialectOverrides("oas20" as unknown as OASDialect)
      ).toThrow(TypeError)
    })
  })

  describe("getSchemaKeywords", () => {
    it("adds the OpenAPI keywords and $$ref", () => {
      expect(getOASSchemaKeywords()).toEqual(
        expect.arrayContaining([
          "properties",
          "discriminator",
          "xml",
          "externalDocs",
          "example",
          "$$ref",
        ])
      )
    })

    it("never shows $$ref as a keyword", () => {
      const root = renderExpanded(
        { type: "object", $$ref: "#/a", "x-ext": 1, properties: {} },
        { config: { showExtensionKeywords: true } }
      )

      expect(keyword(root, "extensionKeywords").textContent).toContain("x-ext")
      expect(root.textContent).not.toContain("$$ref")
      expect(keyword(root, "$$ref")).toBeNull()
    })

    it("does not make a schema expandable through $$ref alone", () => {
      const root = render({ type: "string", $$ref: "#/a" }).getDOMNode()

      expect(root.hasAttribute("data-expanded")).toBe(false)
    })
  })

  describe("getProperties", () => {
    const schema = {
      type: "object",
      properties: {
        plain: { type: "string" },
        ro: { type: "string", readOnly: true },
        wo: { type: "string", writeOnly: true },
      },
    }

    it.each([
      [true, true, ["plain", "ro", "wo"]],
      [true, false, ["plain", "ro"]],
      [false, true, ["plain", "wo"]],
      [false, false, ["plain"]],
    ])(
      "includeReadOnly=%s includeWriteOnly=%s",
      (includeReadOnly, includeWriteOnly, expected) => {
        expect(
          Object.keys(
            getOASProperties(schema, { includeReadOnly, includeWriteOnly })
          )
        ).toEqual(expected)

        const root = renderExpanded(schema, {
          options: { includeReadOnly, includeWriteOnly },
        })
        expect(propertyNames(root)).toEqual(expected)
      }
    )

    it("handles schemas without properties", () => {
      expect(
        getOASProperties(true, {
          includeReadOnly: true,
          includeWriteOnly: true,
        })
      ).toEqual({})
    })
  })

  describe("OAS keywords", () => {
    let root: HTMLElement

    beforeAll(() => {
      root = renderExpanded(oasSchema, {
        config: { showExtensionKeywords: true },
      })
    })

    it("places them after examples, in the oas31 order", () => {
      const order = Array.from(root.querySelectorAll("[data-keyword]"))
        .map((element) => element.getAttribute("data-keyword"))
        .filter((name) =>
          [
            "examples",
            "discriminator",
            "xml",
            "externalDocs",
            "example",
            "extensionKeywords",
          ].includes(name)
        )

      expect(order).toEqual([
        "examples",
        "discriminator",
        "xml",
        "externalDocs",
        "example",
        "extensionKeywords",
      ])
    })

    it("renders discriminator with propertyName and mapping", () => {
      const discriminator = keyword(root, "discriminator")

      expect(discriminator.textContent).toContain("Discriminator")
      expect(discriminator.textContent).toContain("petType")
      expect(discriminator.textContent).toContain("dog#/components/schemas/Dog")
      expect(discriminator.getAttribute("data-expanded")).toBe("true")
    })

    it("renders xml with attributes and fields", () => {
      const xml = keyword(root, "xml")

      expect(xml.textContent).toContain("XML")
      expect(xml.textContent).toContain("attribute")
      expect(xml.textContent).toContain("wrapped")
      expect(xml.textContent).toContain("namepet")
      expect(xml.textContent).toContain("namespacehttps://example.com/schema")
      expect(xml.textContent).toContain("prefixex")
    })

    it("renders externalDocs with markdown description and link", () => {
      const externalDocs = keyword(root, "externalDocs")
      const link = externalDocs.querySelector("a")

      expect(externalDocs.textContent).toContain("External documentation")
      expect(
        keyword(externalDocs, "description").querySelector("em").textContent
      ).toBe("docs")
      expect(link.getAttribute("href")).toBe("https://example.com/docs")
      expect(link.getAttribute("target")).toBe("_blank")
      expect(link.getAttribute("rel")).toBe("noopener noreferrer")
    })

    it("renders example", () => {
      expect(keyword(root, "example").textContent).toContain("Example")
      expect(keyword(root, "example").textContent).toContain('"cat"')
      expect(
        keyword(renderExpanded({ type: "number", example: 0 }), "example")
          .textContent
      ).toBe("Example0")
    })

    it("renders OpenAPI extensions of the OAS objects", () => {
      expect(keyword(root, "x-discriminator-ext").textContent).toContain('"d"')
      expect(keyword(root, "x-xml-ext").textContent).toContain("flag")
      expect(keyword(root, "x-docs-ext").textContent).toContain("1")
      expect(keyword(root, "x-schema-ext")).toBeNull() // it's in Extension Keywords
    })

    it("hides OpenAPI extensions without showExtensions", () => {
      const hidden = renderExpanded(oasSchema, {
        options: { showExtensions: false },
      })

      expect(keyword(hidden, "x-discriminator-ext")).toBeNull()
      expect(keyword(hidden, "x-xml-ext")).toBeNull()
      expect(keyword(hidden, "x-docs-ext")).toBeNull()
      expect(keyword(hidden, "extensionKeywords")).toBeNull()
    })

    it("makes schemas with only OAS keywords expandable", () => {
      for (const schema of [
        { xml: { name: "a" } },
        { discriminator: { propertyName: "a" } },
        { externalDocs: { url: "https://example.com" } },
        { example: null },
      ]) {
        expect(render(schema).getDOMNode().getAttribute("data-expanded")).toBe(
          "false"
        )
      }
    })

    it("renders the description as markdown", () => {
      const description = keyword(root, "description")

      expect(description.querySelector("strong").textContent).toBe("pet")
    })

    it("styles only with sui: utilities (besides the Markdown component's own class)", () => {
      const tokens = classTokens(root)

      expect(tokens.length).toBeGreaterThan(0)
      expect(
        tokens.filter((token) => token.startsWith("json-schema-2020-12"))
      ).toEqual([])
      // `markdown` is set by the core Markdown component itself
      expect(
        tokens.filter(
          (token) => !token.startsWith("sui:") && token !== "markdown"
        )
      ).toEqual([])
    })
  })

  describe("security", () => {
    it("sanitizes markdown descriptions through the Markdown component", () => {
      const root = renderExpanded({
        type: "string",
        description:
          "Hello <script>alert(1)</script> <img src=x onerror=\"alert('xss')\">",
      })
      const description = keyword(root, "description")

      expect(description.querySelector(".markdown")).not.toBeNull()
      expect(description.querySelector("script")).toBeNull()
      expect(description.querySelector("img").hasAttribute("onerror")).toBe(
        false
      )
      expect(description.innerHTML).not.toContain("onerror")
    })

    it("sanitizes the externalDocs description", () => {
      const root = renderExpanded({
        externalDocs: { description: "<img src=x onerror=alert(1)>" },
      })
      const externalDocs = keyword(root, "externalDocs")

      expect(externalDocs.querySelector("img").hasAttribute("onerror")).toBe(
        false
      )
    })

    it.each([
      "javascript:alert(1)",
      "  JavaScript:alert(1)",
      "data:text/html,<script>alert(1)</script>",
      "vbscript:msgbox(1)",
    ])("renders externalDocs url %j with href about:blank", (url) => {
      const root = renderExpanded({ externalDocs: { url } })
      const link = keyword(root, "externalDocs").querySelector("a")

      expect(link.getAttribute("href")).toBe("about:blank")
    })

    it("renders the description as escaped text without a Markdown component", () => {
      const overrides = getOASDialectOverrides("oas31")
      const JSONSchemaUnified = withJSONSchemaContext(JSONSchema, overrides)
      const wrapper = mount(
        <JSONSchemaUnified schema={{ description: "<b>bold</b>" }} />
      )
      wrapper.find("button").first().simulate("click")
      const description = keyword(wrapper.getDOMNode(), "description")

      expect(description.querySelector("b")).toBeNull()
      expect(description.textContent).toBe("<b>bold</b>")
    })
  })

  describe("through the system HOC", () => {
    const makeSystem = (components: Record<string, unknown>) => {
      const registered: Record<string, unknown> = {}
      const system = {
        getSystem: () => system,
        getComponent: (name: string) => registered[name],
        getConfigs: () => ({ showExtensions: false }),
      }
      const plugin = JSONSchemaUnifiedPlugin({
        getSystem: () => system,
        fn: {},
      })
      Object.assign(registered, plugin.components, { Markdown }, components)
      return system
    }

    it("renders the system's OAS components, Markdown and slots", () => {
      const WrappedXml = () => <p data-testid="wrapped-xml">wrapped</p>
      const system = makeSystem({ JSONSchemaUnifiedKeywordXml: WrappedXml })
      const withSystemContext = makeWithJSONSchemaSystemContext(system)
      const JSONSchemaUnified = withSystemContext(
        system.getComponent("JSONSchemaUnified") as React.ComponentType<
          Record<string, unknown>
        >,
        getOASDialectOverrides("oas32", { defaultExpandedLevels: 1 })
      )
      const root = mount(
        <JSONSchemaUnified
          schema={{
            description: "*md*",
            xml: { name: "a" },
            properties: { ro: { readOnly: true }, plain: {} },
          }}
        />
      ).getDOMNode()

      expect(keyword(root, "description").querySelector("em")).not.toBeNull()
      expect(root.querySelector('[data-testid="wrapped-xml"]')).not.toBeNull()
      expect(propertyNames(root)).toEqual(["plain"])
    })
  })

  describe("plugin registration", () => {
    const plugin = JSONSchemaUnifiedPlugin({
      getSystem: () => ({
        getSystem: null,
        getComponent: () => null,
        getConfigs: () => ({}),
      }),
      fn: {},
    })

    it("registers the OAS keyword components", () => {
      expect(Object.keys(plugin.components)).toEqual(
        expect.arrayContaining([
          "JSONSchemaUnifiedKeywordOASDescription",
          "JSONSchemaUnifiedKeywordOASExamples",
          "JSONSchemaUnifiedKeywordOASProperties",
          "JSONSchemaUnifiedKeywordDiscriminator",
          "JSONSchemaUnifiedKeywordXml",
          "JSONSchemaUnifiedKeywordExternalDocs",
          "JSONSchemaUnifiedKeywordExample",
          "JSONSchemaUnifiedKeywordOpenAPIExtensions",
        ])
      )
      // the 2020-12 plain-text description stays registered
      expect(plugin.components).toHaveProperty(
        "JSONSchemaUnifiedKeywordDescription"
      )
    })

    it("exposes the dialect helpers under fn.jsonSchemaUnified", () => {
      expect(plugin.fn.jsonSchemaUnified.getOASDialectOverrides).toBe(
        getOASDialectOverrides
      )
      expect(plugin.fn.jsonSchemaUnified.getOASProperties).toBe(
        getOASProperties
      )
    })
  })
})
