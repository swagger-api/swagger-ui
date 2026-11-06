/**
 * @prettier
 */
import { Map } from "immutable"
import { createSelector } from "reselect"

import { getJSONSchemaDialect } from "./fn"

const selectSpecJson = (state: Map<string, unknown> | undefined) =>
  (state || Map()).get("json", Map())

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
  jsonSchemaDialect,
  (dialect) => dialect !== null
)
