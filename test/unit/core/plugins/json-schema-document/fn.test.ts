/**
 * @prettier
 */
import YAML, { JSON_SCHEMA } from "js-yaml"
import { fromJS } from "immutable"

import {
  JSON_SCHEMA_2020_12,
  getJSONSchemaDialect,
  getRootSchemaKeyword,
  isJSONSchemaDocument,
  getDependentRequired,
  getSchemaDependencies,
  hasKeyword as hasDialectKeyword,
  isUnsupportedJSONSchemaDocument,
  makeGetSchemaKeywords,
  makeGetType,
  makeIsExpandable,
  normalizeDialectIdentifier,
  OPENAPI_NUMBER_FORMATS,
  stringifyAsWritten,
} from "core/plugins/json-schema-document/fn"
import {
  getDependentRequired as getJSONSchema202012DependentRequired,
  getSchemaKeywords as getJSONSchema202012Keywords,
  hasKeyword,
  isBooleanJSONSchema,
  makeGetType as makeJSONSchema202012GetType,
  makeIsExpandable as makeJSONSchema202012IsExpandable,
} from "core/plugins/json-schema-2020-12/fn"

// as the spec plugin parses both JSON and YAML (specActions.parseToJson)
const parse = (source: string) =>
  fromJS(YAML.load(source, { schema: JSON_SCHEMA }))

const withRootSchema = ($schema: unknown, rest: Record<string, unknown> = {}) =>
  fromJS({ $schema, ...rest })

describe("json-schema-document detection", () => {
  describe("a root $schema naming JSON Schema 2020-12", () => {
    it("is detected in JSON", () => {
      const spec = parse(
        JSON.stringify({
          $schema: "https://json-schema.org/draft/2020-12/schema",
          type: "object",
        })
      )

      expect(getJSONSchemaDialect(spec)).toBe(JSON_SCHEMA_2020_12)
      expect(isJSONSchemaDocument(spec)).toBe(true)
      expect(isUnsupportedJSONSchemaDocument(spec)).toBe(false)
    })

    it("is detected in YAML", () => {
      const spec = parse(
        "$schema: https://json-schema.org/draft/2020-12/schema\ntype: object\n"
      )

      expect(getJSONSchemaDialect(spec)).toBe(JSON_SCHEMA_2020_12)
      expect(isJSONSchemaDocument(spec)).toBe(true)
    })

    it("is detected with an empty fragment, which is normalised", () => {
      const spec = withRootSchema(
        "https://json-schema.org/draft/2020-12/schema#"
      )

      expect(getJSONSchemaDialect(spec)).toBe(JSON_SCHEMA_2020_12)
    })

    it("is detected when $schema is the only keyword", () => {
      expect(isJSONSchemaDocument(withRootSchema(JSON_SCHEMA_2020_12))).toBe(
        true
      )
    })
  })

  describe("a root $schema naming no supported dialect", () => {
    it.each([
      ["the http:// scheme", "http://json-schema.org/draft/2020-12/schema"],
      ["two fragments", `${JSON_SCHEMA_2020_12}##`],
      ["a non-empty fragment", `${JSON_SCHEMA_2020_12}#/x`],
      ["a trailing slash", `${JSON_SCHEMA_2020_12}/`],
      ["other letter case", JSON_SCHEMA_2020_12.toUpperCase()],
      ["a custom meta-schema", "https://example.com/schemas/meta"],
      ["the OAS 3.1 dialect", "https://spec.openapis.org/oas/3.1/dialect/base"],
      ["2019-09", "https://json-schema.org/draft/2019-09/schema"],
      ["Draft 7", "http://json-schema.org/draft-07/schema#"],
      ["Draft 6", "http://json-schema.org/draft-06/schema#"],
      ["Draft 4", "http://json-schema.org/draft-04/schema#"],
      ["an empty string", ""],
    ])("is refused: %s", (_, $schema) => {
      const spec = withRootSchema($schema, { type: "object" })

      expect(getJSONSchemaDialect(spec)).toBeNull()
      expect(isJSONSchemaDocument(spec)).toBe(false)
      expect(isUnsupportedJSONSchemaDocument(spec)).toBe(true)
      expect(getRootSchemaKeyword(spec)).toBe($schema)
    })

    it.each([
      ["a number", 2020, "2020"],
      ["null", null, "null"],
      ["an object", { $id: "x" }, '{"$id":"x"}'],
      ["an array", [JSON_SCHEMA_2020_12], `["${JSON_SCHEMA_2020_12}"]`],
    ])("is refused when it is %s", (_, $schema, written) => {
      const spec = withRootSchema($schema)

      expect(isJSONSchemaDocument(spec)).toBe(false)
      expect(isUnsupportedJSONSchemaDocument(spec)).toBe(true)
      expect(getRootSchemaKeyword(spec)).toBe(written)
    })
  })

  describe("documents that aren't JSON Schema documents", () => {
    it.each([
      ["OpenAPI 3.0", { openapi: "3.0.4" }],
      ["OpenAPI 3.1", { openapi: "3.1.0" }],
      ["OpenAPI 3.2", { openapi: "3.2.0" }],
      ["Swagger 2.0", { swagger: "2.0" }],
      ["AsyncAPI 3.0", { asyncapi: "3.0.0" }],
      ["Arazzo 1.0.1", { arazzo: "1.0.1" }],
      ["an API description field without a valid value", { openapi: null }],
    ])(
      "are not detected or refused with a root 2020-12 $schema: %s",
      (_, fields) => {
        const spec = withRootSchema(JSON_SCHEMA_2020_12, {
          info: { title: "t", version: "1" },
          ...fields,
        })

        expect(getJSONSchemaDialect(spec)).toBeNull()
        expect(isJSONSchemaDocument(spec)).toBe(false)
        expect(isUnsupportedJSONSchemaDocument(spec)).toBe(false)
      }
    )

    it("are not detected when only an embedded resource has $schema", () => {
      const spec = parse(
        [
          "title: Nested",
          "type: object",
          "properties:",
          "  name:",
          "    $id: https://example.com/schemas/name",
          "    $schema: https://json-schema.org/draft/2020-12/schema",
          "    type: string",
        ].join("\n")
      )

      expect(isJSONSchemaDocument(spec)).toBe(false)
      expect(isUnsupportedJSONSchemaDocument(spec)).toBe(false)
    })

    it("are not detected without $schema", () => {
      const spec = parse("type: object\n")

      expect(isJSONSchemaDocument(spec)).toBe(false)
      expect(isUnsupportedJSONSchemaDocument(spec)).toBe(false)
    })

    it.each([
      ["a string", "https://json-schema.org/draft/2020-12/schema"],
      ["a list", "- $schema: https://json-schema.org/draft/2020-12/schema"],
      ["empty", ""],
    ])("are not detected when the root is %s", (_, source) => {
      const spec = parse(source)

      expect(isJSONSchemaDocument(spec)).toBe(false)
      expect(isUnsupportedJSONSchemaDocument(spec)).toBe(false)
      expect(getRootSchemaKeyword(spec)).toBe("")
    })
  })

  it("normalises only an empty fragment", () => {
    expect(normalizeDialectIdentifier(`${JSON_SCHEMA_2020_12}#`)).toBe(
      JSON_SCHEMA_2020_12
    )
    expect(normalizeDialectIdentifier(`${JSON_SCHEMA_2020_12}##`)).toBe(
      `${JSON_SCHEMA_2020_12}#`
    )
    expect(normalizeDialectIdentifier(JSON_SCHEMA_2020_12)).toBe(
      JSON_SCHEMA_2020_12
    )
  })
})

describe("json-schema-document makeGetSchemaKeywords", () => {
  it("adds the default meta-schema's keywords and swagger-client's $$ref annotation", () => {
    const getSchemaKeywords = makeGetSchemaKeywords(() => ["$ref", "type"])

    expect(getSchemaKeywords()).toEqual([
      "$ref",
      "type",
      "definitions",
      "dependencies",
      "$recursiveAnchor",
      "$recursiveRef",
      "$$ref",
    ])
  })

  it("adds none of the OpenAPI keywords", () => {
    const keywords = makeGetSchemaKeywords(() => [])()

    expect(keywords).not.toContain("discriminator")
    expect(keywords).not.toContain("xml")
    expect(keywords).not.toContain("externalDocs")
    expect(keywords).not.toContain("example")
  })
})

describe("json-schema-document makeIsExpandable", () => {
  const keywords = makeGetSchemaKeywords(getJSONSchema202012Keywords)()
  const fn = {
    hasKeyword,
    getExtensionKeywords: (schema: unknown) =>
      schema !== null && typeof schema === "object"
        ? Object.keys(schema).filter((key) => !keywords.includes(key))
        : [],
  }
  const isExpandable = makeIsExpandable(() => fn)
  const isExpandable202012 = makeJSONSchema202012IsExpandable(() => fn)

  it("decides as the json-schema-2020-12 renderer for every 2020-12 keyword", () => {
    const values = [{}, { type: "string" }, "x", 0, false, true, []]

    for (const keyword of getJSONSchema202012Keywords()) {
      for (const value of values) {
        const schema = { [keyword]: value }
        expect([keyword, isExpandable(schema)]).toEqual([
          keyword,
          Boolean(isExpandable202012(schema)),
        ])
      }
    }
    for (const schema of [true, false, null, undefined, {}]) {
      expect(isExpandable(schema)).toBe(Boolean(isExpandable202012(schema)))
    }
  })

  it("expands a schema whose only body keyword is definitions", () => {
    expect(
      isExpandable({
        type: "string",
        definitions: { Slug: { type: "string" } },
      })
    ).toBe(true)
    expect(isExpandable({ type: "string" })).toBe(false)
  })

  it("expands a schema whose only body keyword is a schema dependency", () => {
    expect(
      isExpandable({ type: "object", dependencies: { a: { required: ["b"] } } })
    ).toBe(true)
    expect(isExpandable({ type: "object", dependencies: { a: true } })).toBe(
      true
    )
    // the array form renders on the properties it makes required
    expect(isExpandable({ type: "object", dependencies: { a: ["b"] } })).toBe(
      false
    )
    expect(isExpandable({ type: "object", dependencies: {} })).toBe(false)
  })

  it("expands a schema whose only body keyword is $recursiveAnchor or $recursiveRef", () => {
    expect(isExpandable({ type: "object", $recursiveRef: "#" })).toBe(true)
    expect(isExpandable({ type: "object", $recursiveAnchor: "node" })).toBe(
      true
    )
    // 2019-09's boolean form, shown as written
    expect(isExpandable({ type: "object", $recursiveAnchor: false })).toBe(true)
  })

  it("expands a schema with an extension keyword of this instance", () => {
    expect(isExpandable({ type: "string", "x-internal": true })).toBe(true)
    expect(isExpandable({ type: "string", $$ref: "#/$defs/A" })).toBe(false)
  })
})

describe("json-schema-document dependencies", () => {
  const schema = {
    properties: { a: {}, b: {}, c: {} },
    dependencies: {
      a: ["b"],
      c: { required: ["a"] },
      d: false,
      e: ["b", "c"],
    },
    dependentRequired: { f: ["b"], a: ["c"] },
  }

  it("takes the schema entries of dependencies, like dependentSchemas", () => {
    expect(getSchemaDependencies(schema)).toEqual({
      c: { required: ["a"] },
      d: false,
    })
    for (const value of [undefined, null, [], "a", true]) {
      expect(getSchemaDependencies({ dependencies: value })).toEqual({})
    }
    expect(getSchemaDependencies(true)).toEqual({})
  })

  it("adds the array entries of dependencies to dependentRequired", () => {
    expect(getDependentRequired("b", schema)).toEqual(["f", "a", "e"])
    expect(getDependentRequired("c", schema)).toEqual(["a", "e"])
    expect(getDependentRequired("a", schema)).toEqual([])
    expect(getDependentRequired("b", { dependencies: { a: ["b"] } })).toEqual([
      "a",
    ])
  })

  it("decides as the json-schema-2020-12 renderer without dependencies", () => {
    const schemas = [
      { dependentRequired: { f: ["b"], a: ["c", "b"] } },
      { dependentRequired: { f: "b" } },
      { dependentRequired: {} },
      {},
      true,
      null,
    ]

    for (const s of schemas) {
      for (const name of ["a", "b", "c"]) {
        expect(getDependentRequired(name, s)).toEqual(
          getJSONSchema202012DependentRequired(name, s)
        )
      }
    }
  })
})

describe("json-schema-document keyword values", () => {
  it("finds a keyword whatever its value", () => {
    expect(
      hasDialectKeyword({ $recursiveAnchor: false }, "$recursiveAnchor")
    ).toBe(true)
    expect(hasDialectKeyword({ $recursiveRef: "" }, "$recursiveRef")).toBe(true)
    expect(hasDialectKeyword({}, "$recursiveRef")).toBe(false)
    expect(hasDialectKeyword(true, "$recursiveRef")).toBe(false)
    expect(hasDialectKeyword(null, "$recursiveRef")).toBe(false)
  })

  it("shows a value as written", () => {
    expect(stringifyAsWritten("#")).toBe("#")
    expect(stringifyAsWritten("")).toBe("")
    expect(stringifyAsWritten(true)).toBe("true")
    expect(stringifyAsWritten(false)).toBe("false")
    expect(stringifyAsWritten(null)).toBe("null")
    expect(stringifyAsWritten({ a: 1 })).toBe('{"a":1}')
  })
})

describe("json-schema-document makeGetType", () => {
  const fn = { hasKeyword, getExtensionKeywords: () => [], isBooleanJSONSchema }
  const getType = makeGetType(() => fn)
  const getType202012 = makeJSONSchema202012GetType(() => fn)

  it("decides as the json-schema-2020-12 renderer without OpenAPI number formats", () => {
    const cyclic: Record<string, unknown> = { type: "object" }
    cyclic.properties = { self: cyclic }
    cyclic.items = cyclic
    const schemas: unknown[] = [
      undefined,
      null,
      true,
      false,
      "string",
      {},
      { type: "string" },
      { type: ["string", "null"] },
      { type: ["array", "null"], items: { type: "integer" } },
      { type: "array", prefixItems: [{ type: "string" }], items: false },
      { type: "unknown" },
      { prefixItems: [{ type: "string" }, {}] },
      { items: { format: "date" } },
      { contains: { type: "number" } },
      { properties: {} },
      { additionalProperties: false },
      { patternProperties: {} },
      { minimum: 0 },
      { exclusiveMaximum: 1 },
      { multipleOf: 2 },
      { pattern: "^a$" },
      { format: "date-time" },
      { format: "password" },
      { format: "uuid", minimum: 0 },
      { minLength: 1 },
      { maxLength: 2 },
      { contentEncoding: "base64" },
      { contentMediaType: "text/plain" },
      { const: null },
      { const: true },
      { const: 1 },
      { const: 1.5 },
      { const: "a" },
      { const: [1] },
      { const: { a: 1 } },
      { not: {} },
      { not: { type: "string" } },
      { oneOf: [{ type: "string" }, { type: "integer" }] },
      { anyOf: [{ type: "string" }, true] },
      { allOf: [{ type: "object" }, { properties: {} }] },
      { type: "string", oneOf: [{ minLength: 1 }] },
      cyclic,
    ]

    for (const schema of schemas) {
      expect([schema, getType(schema as never)]).toEqual([
        schema,
        getType202012(schema),
      ])
    }
  })

  it("infers no type from the OpenAPI number formats", () => {
    expect(OPENAPI_NUMBER_FORMATS).toEqual([
      "int32",
      "int64",
      "float",
      "double",
    ])

    for (const format of OPENAPI_NUMBER_FORMATS) {
      expect(getType({ format })).toBe("any")
      expect(getType({ items: { format } })).toBe("array<any>")
      expect(getType({ oneOf: [{ format }, { type: "null" }] })).toBe(
        "(any | null)"
      )
      // other keywords still imply a type
      expect(getType({ format, minimum: 0 })).toBe("number | integer")
      expect(getType({ format, maxLength: 3 })).toBe("string")
    }
  })

  it("keeps an explicit type", () => {
    expect(getType({ type: "integer", format: "int32" })).toBe("integer")
    expect(getType({ type: "number", format: "double" })).toBe("number")
    expect(getType({ type: "string", format: "int64" })).toBe("string")
  })

  it("differs from the json-schema-2020-12 renderer only there", () => {
    expect(getType202012({ format: "int32" })).toBe("integer")
    expect(getType202012({ format: "double" })).toBe("number")
    expect(getType({ format: "int32" })).toBe("any")
    expect(getType({ format: "double" })).toBe("any")
  })
})
