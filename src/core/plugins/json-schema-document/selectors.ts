/**
 * @prettier
 */
import { Map } from "immutable"
import { createSelector } from "reselect"

import {
  getJSONSchemaDialect,
  getRootSchemaKeyword,
  isUnsupportedJSONSchemaDocument as isUnsupportedJSONSchemaDocumentFn,
} from "./fn"

interface System {
  specSelectors: {
    specJson: () => Map<string, unknown>
    jsonSchemaDialect: () => string | null
  }
}

const selectSpecJson = (_state: unknown, system: System) =>
  system.specSelectors.specJson()

/**
 * The meta-schema identifier of the delivered JSON Schema dialect the document
 * is written in (its normalised root `$schema`), or `null`.
 */
export const jsonSchemaDialect = createSelector(
  selectSpecJson,
  getJSONSchemaDialect
)

/**
 * Whether the document is a standalone JSON Schema document of a delivered
 * dialect, rendered by `JSONSchemaDocument` instead of the OpenAPI layout.
 */
export const isJSONSchemaDocument = createSelector(
  (_state: unknown, system: System) => system.specSelectors.jsonSchemaDialect(),
  (dialect) => dialect !== null
)

/**
 * Whether the root declares a JSON Schema dialect that isn't delivered: the
 * document is refused with a message instead of being rendered.
 */
export const isUnsupportedJSONSchemaDocument = createSelector(
  selectSpecJson,
  isUnsupportedJSONSchemaDocumentFn
)

/**
 * The root `$schema` as written, for messages.
 */
export const rootSchemaKeyword = createSelector(
  selectSpecJson,
  getRootSchemaKeyword
)
