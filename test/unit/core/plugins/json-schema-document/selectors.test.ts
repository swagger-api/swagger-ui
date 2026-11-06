/**
 * @prettier
 */
import { fromJS, Map } from "immutable"

import {
  isJSONSchemaDocument,
  jsonSchemaDialect,
} from "core/plugins/json-schema-document/selectors"

const stateWith = (json: Record<string, unknown>) => fromJS({ json })

describe("json-schema-document selectors", () => {
  it("select the dialect of a JSON Schema 2020-12 document", () => {
    const state = stateWith({
      $schema: "https://json-schema.org/draft/2020-12/schema#",
    })

    expect(jsonSchemaDialect(state)).toBe(
      "https://json-schema.org/draft/2020-12/schema"
    )
    expect(isJSONSchemaDocument(state)).toBe(true)
  })

  it("select nothing for an unsupported dialect", () => {
    const state = stateWith({
      $schema: "https://json-schema.org/draft/2019-09/schema",
    })

    expect(jsonSchemaDialect(state)).toBeNull()
    expect(isJSONSchemaDocument(state)).toBe(false)
  })

  it("select nothing for an OpenAPI document with a root $schema", () => {
    const state = stateWith({
      openapi: "3.1.0",
      $schema: "https://json-schema.org/draft/2020-12/schema",
    })

    expect(jsonSchemaDialect(state)).toBeNull()
    expect(isJSONSchemaDocument(state)).toBe(false)
  })

  it("select nothing before a document is loaded", () => {
    expect(jsonSchemaDialect(Map())).toBeNull()
    expect(isJSONSchemaDocument(Map())).toBe(false)
    expect(isJSONSchemaDocument(undefined)).toBe(false)
  })
})
