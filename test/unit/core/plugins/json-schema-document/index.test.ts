/**
 * @prettier
 */
import { fromJS, Map } from "immutable"

import JSONSchemaDocumentPlugin from "core/plugins/json-schema-document"

const dialect = "https://json-schema.org/draft/2020-12/schema"

// eslint-disable-next-line no-unused-vars
type Selector = (state: Map<string, unknown>) => (system: unknown) => unknown

// as the system binds a spec selector: `selector(specState)`, then `(system)`
// when that returns a function
const bind = (json: Record<string, unknown>) => {
  const selectors = JSONSchemaDocumentPlugin().statePlugins.spec
    .selectors as unknown as Record<string, Selector>
  const state = fromJS({ json }) as Map<string, unknown>
  const system: { specSelectors: Record<string, () => unknown> } = {
    specSelectors: { specJson: () => state.get("json") },
  }
  system.specSelectors.jsonSchemaDialect = () =>
    selectors.jsonSchemaDialect(state)(system)

  return Object.fromEntries(
    Object.entries(selectors).map(([name, selector]) => [
      name,
      () => selector(state)(system),
    ])
  )
}

describe("json-schema-document plugin selectors", () => {
  it("work when called the way the system calls registered selectors", () => {
    const selectors = bind({ $schema: dialect })

    expect(selectors.jsonSchemaDialect()).toBe(dialect)
    expect(selectors.isJSONSchemaDocument()).toBe(true)
    expect(selectors.isUnsupportedJSONSchemaDocument()).toBe(false)
    expect(selectors.rootSchemaKeyword()).toBe(dialect)
  })

  it("refuse an unsupported dialect", () => {
    const $schema = "https://json-schema.org/draft/2019-09/schema"
    const selectors = bind({ $schema })

    expect(selectors.isJSONSchemaDocument()).toBe(false)
    expect(selectors.isUnsupportedJSONSchemaDocument()).toBe(true)
    expect(selectors.rootSchemaKeyword()).toBe($schema)
  })
})
