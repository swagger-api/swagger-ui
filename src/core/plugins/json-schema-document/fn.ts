/**
 * @prettier
 */
import { Map } from "immutable"

/**
 * Meta-schema identifier of JSON Schema 2020-12, the value a root `$schema` carries.
 *
 * https://json-schema.org/draft/2020-12/schema
 */
export const JSON_SCHEMA_2020_12 =
  "https://json-schema.org/draft/2020-12/schema"

/**
 * Meta-schema identifiers of the delivered dialects. A root `$schema` naming
 * anything else is refused, never rendered as one of these dialects: a custom
 * meta-schema, an OpenAPI dialect, the `http://` form of the 2020-12
 * identifier, a draft whose support isn't delivered yet.
 */
export const SUPPORTED_DIALECTS: readonly {
  identifier: string
  name: string
}[] = [{ identifier: JSON_SCHEMA_2020_12, name: "JSON Schema 2020-12" }]

/**
 * Root fields of API descriptions. OpenAPI, Swagger, AsyncAPI and Arazzo
 * documents may carry a root `$schema` too; a root with any of these fields
 * (whatever its value) is never a standalone JSON Schema document. This is the
 * rule of swagger-client's `json-schema-2020-12-apidom` resolve strategy.
 */
export const API_DESCRIPTION_FIELDS: readonly string[] = [
  "openapi",
  "swagger",
  "asyncapi",
  "arazzo",
]

/**
 * Documents add or drop the empty fragment of an identifier
 * (`https://json-schema.org/draft/2020-12/schema#`); only that is normalised.
 */
export const normalizeDialectIdentifier = (identifier: string): string =>
  identifier.endsWith("#") ? identifier.slice(0, -1) : identifier

/**
 * A document that declares itself a JSON Schema document: its root is an
 * object with a `$schema` keyword and none of the API description fields. Only
 * the root counts; Schema Objects and other subschemas may carry `$schema` too.
 */
const isJSONSchemaDocumentCandidate = (
  spec: unknown
): spec is Map<string, unknown> =>
  Map.isMap(spec) &&
  spec.has("$schema") &&
  !API_DESCRIPTION_FIELDS.some((field) => spec.has(field))

/**
 * The delivered dialect a document is written in: the normalised identifier of
 * its root `$schema`, or `null` when the document isn't a JSON Schema document
 * of a delivered dialect.
 */
export const getJSONSchemaDialect = (spec: unknown): string | null => {
  if (!isJSONSchemaDocumentCandidate(spec)) return null

  const $schema = spec.get("$schema")
  if (typeof $schema !== "string") return null

  const identifier = normalizeDialectIdentifier($schema)
  return SUPPORTED_DIALECTS.some((dialect) => dialect.identifier === identifier)
    ? identifier
    : null
}

export const isJSONSchemaDocument = (spec: unknown): boolean =>
  getJSONSchemaDialect(spec) !== null

/**
 * A document whose root declares a JSON Schema dialect that isn't delivered:
 * it is refused with a message instead of being rendered.
 */
export const isUnsupportedJSONSchemaDocument = (spec: unknown): boolean =>
  isJSONSchemaDocumentCandidate(spec) && getJSONSchemaDialect(spec) === null

/**
 * The root `$schema` as written, for messages.
 */
export const getRootSchemaKeyword = (spec: unknown): string => {
  if (!Map.isMap(spec)) return ""

  const $schema = spec.get("$schema")
  if (typeof $schema === "string") return $schema

  const value =
    $schema !== null &&
    typeof $schema === "object" &&
    "toJS" in $schema &&
    typeof $schema.toJS === "function"
      ? $schema.toJS()
      : $schema
  return JSON.stringify(value) ?? String(value)
}

/**
 * The 2020-12 keyword list plus `$$ref`, the annotation swagger-client adds to
 * every schema it resolved, so that it isn't listed as an extension keyword.
 */
export const makeGetSchemaKeywords = (
  original: () => string[]
): (() => string[]) => {
  const keywords = [...original(), "$$ref"]

  return () => keywords
}
