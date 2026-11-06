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
  isUnsupportedJSONSchemaDocument,
  makeGetSchemaKeywords,
  normalizeDialectIdentifier,
} from "core/plugins/json-schema-document/fn"

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
  it("adds swagger-client's $$ref annotation to the dialect's keywords", () => {
    const getSchemaKeywords = makeGetSchemaKeywords(() => ["$ref", "type"])

    expect(getSchemaKeywords()).toEqual(["$ref", "type", "$$ref"])
  })

  it("adds none of the OpenAPI keywords", () => {
    const keywords = makeGetSchemaKeywords(() => [])()

    expect(keywords).not.toContain("discriminator")
    expect(keywords).not.toContain("xml")
    expect(keywords).not.toContain("externalDocs")
    expect(keywords).not.toContain("example")
  })
})
