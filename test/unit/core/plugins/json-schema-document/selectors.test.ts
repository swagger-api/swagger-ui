/**
 * @prettier
 */
import { fromJS, Map } from "immutable"

import {
  isJSONSchemaDocument,
  isUnsupportedJSONSchemaDocument,
  jsonSchemaDialect,
  rootSchemaKeyword,
} from "core/plugins/json-schema-document/selectors"

const dialect = "https://json-schema.org/draft/2020-12/schema"

// the selectors read the document through the spec plugin's `specJson`
const makeSystem = (json?: Record<string, unknown>) => {
  const system = {
    specSelectors: {
      specJson: () => (json ? fromJS(json) : Map()) as Map<string, unknown>,
      jsonSchemaDialect: () => jsonSchemaDialect(undefined, system),
    },
  }
  return system
}

describe("json-schema-document selectors", () => {
  it("select the dialect of a JSON Schema 2020-12 document", () => {
    const system = makeSystem({ $schema: `${dialect}#` })

    expect(jsonSchemaDialect(undefined, system)).toBe(dialect)
    expect(isJSONSchemaDocument(undefined, system)).toBe(true)
    expect(isUnsupportedJSONSchemaDocument(undefined, system)).toBe(false)
    expect(rootSchemaKeyword(undefined, system)).toBe(`${dialect}#`)
  })

  it("select nothing for an unsupported dialect, and refuse it", () => {
    const $schema = "https://json-schema.org/draft/2019-09/schema"
    const system = makeSystem({ $schema })

    expect(jsonSchemaDialect(undefined, system)).toBeNull()
    expect(isJSONSchemaDocument(undefined, system)).toBe(false)
    expect(isUnsupportedJSONSchemaDocument(undefined, system)).toBe(true)
    expect(rootSchemaKeyword(undefined, system)).toBe($schema)
  })

  it("select nothing for an OpenAPI document with a root $schema", () => {
    const system = makeSystem({ openapi: "3.1.0", $schema: dialect })

    expect(jsonSchemaDialect(undefined, system)).toBeNull()
    expect(isJSONSchemaDocument(undefined, system)).toBe(false)
    expect(isUnsupportedJSONSchemaDocument(undefined, system)).toBe(false)
  })

  it("select nothing before a document is loaded", () => {
    const system = makeSystem()

    expect(jsonSchemaDialect(undefined, system)).toBeNull()
    expect(isJSONSchemaDocument(undefined, system)).toBe(false)
    expect(isUnsupportedJSONSchemaDocument(undefined, system)).toBe(false)
    expect(rootSchemaKeyword(undefined, system)).toBe("")
  })
})
