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
 * Keywords of earlier drafts that the JSON Schema 2020-12 default meta-schema
 * (https://json-schema.org/draft/2020-12/schema) still defines in its
 * `properties`, "as they remain in common use"; none of its vocabularies has
 * them. A document whose root `$schema` is that meta-schema may use them:
 *
 * - `definitions`: "implementations SHOULD assume that `$defs` and
 *   `definitions` have the same behavior when that meta-schema is used"
 *   (https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-validation-01.html#appendix-A),
 *   so it renders like `$defs`.
 * - `dependencies`: split into `dependentSchemas` (its schema form) and
 *   `dependentRequired` (its property name array form) by the same appendix,
 *   so each entry renders like the keyword that took over its form.
 */
export const DEFAULT_META_SCHEMA_KEYWORDS: readonly string[] = [
  "definitions",
  "dependencies",
]

/**
 * The 2020-12 keyword list, the keywords of the default meta-schema this
 * instance renders, and `$$ref`, the annotation swagger-client adds to every
 * schema it resolved, so that none of them is listed as an extension keyword.
 */
export const makeGetSchemaKeywords = (
  original: () => string[]
): (() => string[]) => {
  const keywords = [...original(), ...DEFAULT_META_SCHEMA_KEYWORDS, "$$ref"]

  return () => keywords
}

type Schema = Record<string, unknown> | boolean | null | undefined

const isObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value)

const getDependencies = (schema: Schema): [string, unknown][] =>
  isObject(schema) && isObject(schema.dependencies)
    ? Object.entries(schema.dependencies)
    : []

/**
 * The schema form of `dependencies`: the entries whose value is a schema (an
 * object or a boolean), which apply to the whole instance when it has the
 * property, as `dependentSchemas` does.
 */
export const getSchemaDependencies = (
  schema: Schema
): Record<string, Record<string, unknown> | boolean> =>
  Object.fromEntries(
    getDependencies(schema).filter(
      (entry): entry is [string, Record<string, unknown> | boolean] =>
        typeof entry[1] === "boolean" || isObject(entry[1])
    )
  )

/**
 * The properties whose presence makes `propertyName` required: from
 * `dependentRequired` and from the property name array form of
 * `dependencies`. A copy of `getDependentRequired` of the json-schema-2020-12
 * renderer (plugins don't import each other; keep the two in step), plus
 * `dependencies`.
 */
export const getDependentRequired = (
  propertyName: string,
  schema: Schema
): string[] => {
  const entries = [
    ...(isObject(schema) && isObject(schema.dependentRequired)
      ? Object.entries(schema.dependentRequired)
      : []),
    ...getDependencies(schema),
  ]

  return Array.from(
    entries.reduce((acc, [prop, list]) => {
      if (!Array.isArray(list)) return acc
      if (!list.includes(propertyName)) return acc

      acc.add(prop)

      return acc
    }, new Set<string>())
  )
}

/**
 * The `fn` of a json-schema-2020-12 renderer instance, as far as used here.
 */
export interface InstanceFn {
  hasKeyword: (schema: Schema, keyword: string) => boolean
  getExtensionKeywords: (schema: Schema) => string[]
}

/**
 * Whether a schema has anything to show below its head. A copy of
 * `makeIsExpandable` of the json-schema-2020-12 renderer (plugins don't import
 * each other; keep the two in step), plus the keywords of the default
 * meta-schema that render in the body. `fnAccessor` returns the `fn` of the
 * renderer instance, so `getExtensionKeywords` uses this instance's keywords.
 */
export const makeIsExpandable =
  (fnAccessor: () => InstanceFn) =>
  (schema: Schema): boolean => {
    const fn = fnAccessor()
    const s = typeof schema === "object" && schema !== null ? schema : {}

    return Boolean(
      s.$schema ||
        s.$vocabulary ||
        s.$id ||
        s.$anchor ||
        s.$dynamicAnchor ||
        s.$ref ||
        s.$dynamicRef ||
        s.$defs ||
        s.$comment ||
        s.allOf ||
        s.anyOf ||
        s.oneOf ||
        fn.hasKeyword(schema, "not") ||
        fn.hasKeyword(schema, "if") ||
        fn.hasKeyword(schema, "then") ||
        fn.hasKeyword(schema, "else") ||
        s.dependentSchemas ||
        s.prefixItems ||
        fn.hasKeyword(schema, "items") ||
        fn.hasKeyword(schema, "contains") ||
        s.properties ||
        s.patternProperties ||
        fn.hasKeyword(schema, "additionalProperties") ||
        fn.hasKeyword(schema, "propertyNames") ||
        fn.hasKeyword(schema, "unevaluatedItems") ||
        fn.hasKeyword(schema, "unevaluatedProperties") ||
        s.description ||
        s.enum ||
        fn.hasKeyword(schema, "const") ||
        fn.hasKeyword(schema, "contentSchema") ||
        fn.hasKeyword(schema, "default") ||
        s.examples ||
        fn.getExtensionKeywords(schema).length > 0 ||
        // keywords of the default meta-schema
        s.definitions ||
        Object.keys(getSchemaDependencies(schema)).length > 0
    )
  }
