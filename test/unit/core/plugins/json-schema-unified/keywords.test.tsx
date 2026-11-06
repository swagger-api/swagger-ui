/**
 * @prettier
 */
import React from "react"
import { mount } from "enzyme"

import JSONSchema from "core/plugins/json-schema-unified/components/JSONSchema/JSONSchema"
import { withJSONSchemaContext } from "core/plugins/json-schema-unified/hoc"
import type { JSONSchemaConfig } from "core/plugins/json-schema-unified/types"

const render = (
  schema: unknown,
  {
    name = "",
    config = {},
    dependentRequired,
  }: {
    name?: string
    config?: Partial<JSONSchemaConfig>
    dependentRequired?: string[]
  } = {}
) => {
  const JSONSchemaUnified = withJSONSchemaContext(JSONSchema, { config })
  return mount(
    <JSONSchemaUnified
      schema={schema}
      name={name}
      dependentRequired={dependentRequired}
    />
  )
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

const classTokens = (root: Element) =>
  [root, ...Array.from(root.querySelectorAll("*"))]
    .flatMap((element) => Array.from(element.classList))
    .filter(Boolean)

describe("json-schema-unified keywords", () => {
  describe("type", () => {
    it("renders a simple type", () => {
      const root = render({ type: "string" }).getDOMNode()

      expect(keyword(root, "type").tagName).toBe("STRONG")
      expect(keyword(root, "type").textContent).toBe("string")
    })

    it("renders array and union types", () => {
      expect(
        keyword(
          render({ type: "array", items: { type: "integer" } }).getDOMNode(),
          "type"
        ).textContent
      ).toBe("array<integer>")
      expect(
        keyword(render({ type: ["string", "null"] }).getDOMNode(), "type")
          .textContent
      ).toBe("string | null")
    })
  })

  describe("enum, const, default, examples", () => {
    let root: HTMLElement

    beforeAll(() => {
      root = renderExpanded({
        type: "string",
        enum: ["a", "b"],
        const: "a",
        default: "b",
        examples: ["a"],
      })
    })

    it.each([
      ["enum", "Enum"],
      ["const", "Const"],
      ["default", "Default"],
      ["examples", "Examples"],
    ])("renders %s through the JSON viewer", (name, label) => {
      expect(keyword(root, name).textContent).toContain(label)
    })

    it("renders their values", () => {
      expect(keyword(root, "enum").textContent).toContain("#0")
      expect(keyword(root, "enum").textContent).toContain('"a"')
      expect(keyword(root, "enum").textContent).toContain('"b"')
      expect(keyword(root, "const").textContent).toBe('Const"a"')
      expect(keyword(root, "default").textContent).toBe('Default"b"')
      expect(keyword(root, "examples").textContent).toContain('"a"')
    })

    it("renders a falsy const and default", () => {
      const falsy = renderExpanded({ const: 0, default: false })

      expect(keyword(falsy, "const").textContent).toBe("Const0")
      expect(keyword(falsy, "default").textContent).toBe("Defaultfalse")
    })
  })

  describe("constraint", () => {
    const chips = (schema: unknown) =>
      Array.from(
        render(schema)
          .getDOMNode()
          .querySelectorAll('[data-keyword="constraint"]')
      )

    it("renders a number range", () => {
      const [chip] = chips({ type: "number", minimum: 1, maximum: 10 })

      expect(chip.textContent).toBe("[1, 10]")
      expect(chip.getAttribute("data-constraint-scope")).toBe("number")
    })

    it("renders string length and pattern with the string style", () => {
      const [length, pattern] = chips({
        type: "string",
        minLength: 2,
        maxLength: 5,
        pattern: "^a",
      })

      expect(length.textContent).toBe("[2, 5] characters")
      expect(pattern.textContent).toBe("matches ^a")
      expect(pattern.getAttribute("data-constraint-scope")).toBe("string")
      expect(pattern.classList).toContain(
        "sui:bg-json-schema-constraint-string"
      )
      expect(chips({ type: "number", minimum: 1 })[0].classList).toContain(
        "sui:bg-json-schema-constraint"
      )
    })
  })

  describe("dependentRequired", () => {
    it("lists the properties that require this one", () => {
      const root = renderExpanded(
        { type: "string" },
        { name: "billing", dependentRequired: ["card", "address"] }
      )
      const items = keyword(root, "dependentRequired").querySelectorAll("li")

      expect(keyword(root, "dependentRequired").textContent).toContain(
        "Required when defined"
      )
      expect(Array.from(items).map((item) => item.textContent)).toEqual([
        "card",
        "address",
      ])
    })

    it("is rendered for properties named in the parent's dependentRequired", () => {
      const root = renderExpanded({
        type: "object",
        properties: { card: { type: "string" }, address: { type: "string" } },
        dependentRequired: { card: ["address"] },
      })
      const address = root.querySelector('[data-schema-name="address"]')

      expect(keyword(address, "dependentRequired").textContent).toContain(
        "card"
      )
      expect(
        keyword(
          root.querySelector('[data-schema-name="card"]'),
          "dependentRequired"
        )
      ).toBeNull()
    })
  })

  describe("contentSchema", () => {
    it("renders the content schema as a nested schema", () => {
      const root = renderExpanded({
        type: "string",
        contentMediaType: "application/json",
        contentSchema: { type: "object", title: "Payload" },
      })

      expect(keyword(root, "contentSchema").textContent).toContain(
        "Content schema"
      )
      expect(keyword(keyword(root, "contentSchema"), "type").textContent).toBe(
        "object"
      )
    })
  })

  describe("title", () => {
    it("renders the schema title with the styling hook", () => {
      const root = render({ title: "pet", type: "object" }).getDOMNode()
      const title = keyword(root, "title")

      expect(title.tagName).toBe("STRONG")
      expect(title.hasAttribute("data-json-schema-title")).toBe(true)
      expect(title.textContent).toBe("Pet")
      expect(root.getAttribute("data-schema-name")).toBe("Pet")
    })

    it("prefers the name prop and renders nothing without a title", () => {
      expect(
        keyword(render({ title: "pet" }, { name: "dog" }).getDOMNode(), "title")
          .textContent
      ).toBe("dog")
      expect(keyword(render({ type: "string" }).getDOMNode(), "title")).toBe(
        null
      )
    })
  })

  describe("description", () => {
    it("renders the description as plain text", () => {
      const root = renderExpanded({
        type: "string",
        description: "A *pet* name",
      })

      expect(keyword(root, "description").textContent).toBe("A *pet* name")
    })
  })

  describe("deprecated, readOnly, writeOnly", () => {
    it("renders the flags when true", () => {
      const root = render({
        type: "string",
        deprecated: true,
        readOnly: true,
        writeOnly: true,
      }).getDOMNode()

      expect(keyword(root, "deprecated").textContent).toBe("deprecated")
      expect(keyword(root, "readOnly").textContent).toBe("read-only")
      expect(keyword(root, "writeOnly").textContent).toBe("write-only")
    })

    it("renders nothing when false", () => {
      const root = render({
        type: "string",
        deprecated: false,
        readOnly: false,
        writeOnly: false,
      }).getDOMNode()

      expect(keyword(root, "deprecated")).toBeNull()
      expect(keyword(root, "readOnly")).toBeNull()
      expect(keyword(root, "writeOnly")).toBeNull()
    })
  })

  describe("extension keywords", () => {
    const schema = { type: "string", "x-internal": { owner: "team" } }

    it("are shown when showExtensionKeywords is true", () => {
      const root = renderExpanded(schema, {
        config: { showExtensionKeywords: true },
      })
      const extensions = keyword(root, "extensionKeywords")

      expect(extensions.textContent).toContain("Extension Keywords")
      expect(extensions.textContent).toContain("x-internal")
      expect(extensions.textContent).toContain("owner")
    })

    it("are hidden when showExtensionKeywords is false", () => {
      const root = renderExpanded(schema, {
        config: { showExtensionKeywords: false },
      })

      expect(keyword(root, "extensionKeywords")).toBeNull()
    })
  })

  it("styles every keyword only with sui: utilities", () => {
    const root = renderExpanded(
      {
        title: "Everything",
        type: ["object", "null"],
        description: "All keywords",
        deprecated: true,
        readOnly: true,
        writeOnly: true,
        minProperties: 1,
        properties: {
          code: { type: "string", pattern: "^[A-Z]+$", maxLength: 8 },
          count: { type: "integer", minimum: 0, multipleOf: 2 },
        },
        dependentRequired: { code: ["count"] },
        enum: [{ code: "A" }],
        const: { code: "A" },
        default: { code: "A" },
        examples: [{ code: "A" }],
        contentSchema: { type: "string" },
        "x-extension": [1, 2],
      },
      { config: { showExtensionKeywords: true } }
    )
    const tokens = classTokens(root)

    for (const name of [
      "type",
      "title",
      "description",
      "deprecated",
      "readOnly",
      "writeOnly",
      "constraint",
      "dependentRequired",
      "enum",
      "const",
      "default",
      "examples",
      "contentSchema",
      "extensionKeywords",
    ]) {
      expect([name, keyword(root, name)]).not.toEqual([name, null])
    }
    expect(tokens.length).toBeGreaterThan(0)
    expect(
      tokens.filter((token) => token.startsWith("json-schema-2020-12"))
    ).toEqual([])
    expect(tokens.filter((token) => !token.startsWith("sui:"))).toEqual([])
  })
})
