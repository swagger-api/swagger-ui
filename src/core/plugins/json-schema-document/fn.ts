/**
 * @prettier
 */
import { Map as ImmutableMap } from "immutable"

/**
 * Id of the `<main>` landmark of a rendered JSON Schema document, the target
 * of the skip link that replaces "Skip to operations".
 */
export const JSON_SCHEMA_DOCUMENT_ID = "json-schema-document"

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
): spec is ImmutableMap<string, unknown> =>
  ImmutableMap.isMap(spec) &&
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
  if (!ImmutableMap.isMap(spec) || !spec.has("$schema")) return ""

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
 *   so it renders like `$defs`, as a keyword of the schema that has it. (The
 *   `$defs` of the root schema are listed in a section of their own below it
 *   instead, as the schemas of an OpenAPI document; the root `definitions`
 *   stay inline.)
 * - `dependencies`: split into `dependentSchemas` (its schema form) and
 *   `dependentRequired` (its property name array form) by the same appendix,
 *   so each entry renders like the keyword that took over its form.
 * - `$recursiveAnchor`, `$recursiveRef`: renamed to `$dynamicAnchor` and
 *   `$dynamicRef` "with behavior modification"
 *   (https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-01.html#appendix-G-2.4.1.5),
 *   so they are shown as written, like those, and not resolved.
 */
export const DEFAULT_META_SCHEMA_KEYWORDS: readonly string[] = [
  "definitions",
  "dependencies",
  "$recursiveAnchor",
  "$recursiveRef",
]

/**
 * The `definitions` of a schema when there is something to render: a nonempty
 * object. `{}`, arrays and scalars are not rendered, so they don't make a
 * schema expandable either.
 */
export const getDefinitions = (
  schema: unknown
): Record<string, unknown> | null => {
  if (schema === null || typeof schema !== "object") return null

  const { definitions } = schema as { definitions?: unknown }
  return definitions !== null &&
    typeof definitions === "object" &&
    !Array.isArray(definitions) &&
    Object.keys(definitions).length > 0
    ? (definitions as Record<string, unknown>)
    : null
}

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

/**
 * Labels of an entry whose name is the empty string, or only whitespace (both
 * valid property names), and that has no title, `$anchor` or `$id` to show
 * instead: a blank head would be an accordion without a name, a blank list
 * item a requirement nobody can read.
 */
export const EMPTY_NAME_LABEL = "(empty name)"

export const isBlank = (value: string) => value.trim() === ""

/**
 * The label of a blank name. Whitespace-only names are different names, so
 * the label spells out their characters (`(blank name: U+0020)`).
 */
export const getBlankNameLabel = (name: string) =>
  name === ""
    ? EMPTY_NAME_LABEL
    : `(blank name: ${Array.from(name)
        .map(
          (char) =>
            `U+${(char.codePointAt(0) as number)
              .toString(16)
              .toUpperCase()
              .padStart(4, "0")}`
        )
        .join(" ")})`

// what the label of a blank name looks like
const BLANK_NAME_LABEL_PATTERN = /^\((?:empty name|blank name: [^)]*)\)$/

/**
 * The name an entry shows: the name, or its label when it is blank. A name
 * that looks like such a label, or that starts with a quote, is quoted (as
 * JSON, so that a quote in it is escaped): a label always means a blank name,
 * a quoted name is a name, and no two names show alike, wherever either is
 * shown.
 */
export const getNameLabel = (name: string) => {
  if (isBlank(name)) return getBlankNameLabel(name)

  return name.startsWith('"') || BLANK_NAME_LABEL_PATTERN.test(name)
    ? JSON.stringify(name)
    : name
}

/**
 * The name an entry shows when the name is what identifies it (the property
 * that triggers a dependency): its label whatever the title of its schema.
 */
export const getTriggerName = getNameLabel

/**
 * The property names of a "Required when defined" list as the renderer shows
 * them (`getNameLabel`), each on its own.
 */
export const getDependentRequiredLabels = (names: string[]): string[] =>
  names.map(getNameLabel)

/**
 * The name the renderer shows for an entry of a keyword that lists
 * subschemas by name: its label, nothing for a blank name when the schema has
 * a title to show.
 */
export const getDisplayName = <S>(
  name: string,
  subschema: S,
  getTitle: (schema: S) => string
) => {
  if (isBlank(name) && !isBlank(getTitle(subschema))) return ""

  return getNameLabel(name)
}

/**
 * The expansion path token of an entry named "": one that no other entry's
 * name is, so that it keeps a path of its own whatever label it shows. Every
 * other entry's token is its name.
 */
export const getEmptyNameIdentifier = (entries: Record<string, unknown>) => {
  let identifier = EMPTY_NAME_LABEL
  while (identifier in entries) identifier += "_"
  return identifier
}

type Schema = Record<string, unknown> | boolean | null | undefined

const isObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value)

/**
 * Whether a schema object has the keyword, whatever its value. An object
 * without it is no less an object, so the predicate names the keyword.
 */
export const hasKeyword = <K extends string>(
  schema: Schema,
  keyword: K
): schema is Record<string, unknown> & Record<K, unknown> =>
  isObject(schema) && Object.hasOwn(schema, keyword)

/**
 * A keyword value as written: a string as is, anything else as JSON.
 */
export const stringifyAsWritten = (value: unknown): string =>
  typeof value === "string" ? value : (JSON.stringify(value) ?? String(value))

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
 * For each property name, the properties whose presence makes it required,
 * in the order `dependentRequired` and then `dependencies` list them.
 */
type DependentRequiredIndex = Map<string, Set<string>>

// `Properties` asks for every declared property of one schema in turn; the
// index is built once per schema object instead of once per property
const dependentRequiredIndexes = new WeakMap<object, DependentRequiredIndex>()

const getDependentRequiredIndex = (
  schema: Record<string, unknown>
): DependentRequiredIndex => {
  const cached = dependentRequiredIndexes.get(schema)
  if (cached) return cached

  const entries = [
    ...(isObject(schema.dependentRequired)
      ? Object.entries(schema.dependentRequired)
      : []),
    ...getDependencies(schema),
  ]
  const index: DependentRequiredIndex = new Map()

  for (const [prop, list] of entries) {
    if (!Array.isArray(list)) continue

    for (const name of list) {
      const props = index.get(name) ?? new Set<string>()
      props.add(prop)
      index.set(name, props)
    }
  }

  dependentRequiredIndexes.set(schema, index)

  return index
}

/**
 * The properties whose presence makes `propertyName` required: from
 * `dependentRequired` and from the property name array form of
 * `dependencies`. A copy of `getDependentRequired` of the json-schema-2020-12
 * renderer (plugins don't import each other; keep the two in step), plus
 * `dependencies`. It answers from an index built once per schema object, so a
 * schema with many properties and dependencies isn't scanned for each
 * property; a schema object isn't changed while it is rendered.
 */
export const getDependentRequired = (
  propertyName: string,
  schema: Schema
): string[] =>
  isObject(schema)
    ? Array.from(getDependentRequiredIndex(schema).get(propertyName) ?? [])
    : []

/**
 * The `fn` of a json-schema-2020-12 renderer instance, as far as used here.
 */
export interface IsExpandableFn {
  hasKeyword: (schema: Schema, keyword: string) => boolean
  getExtensionKeywords: (schema: Schema) => string[]
}

export interface InstanceFn extends IsExpandableFn {
  isBooleanJSONSchema: (schema: unknown) => schema is boolean
}

/**
 * Whether a schema has anything to show below its head. A copy of
 * `makeIsExpandable` of the json-schema-2020-12 renderer (plugins don't import
 * each other; keep the two in step), plus the keywords of the default
 * meta-schema that render in the body. `fnAccessor` returns the `fn` of the
 * renderer instance, so `getExtensionKeywords` uses this instance's keywords.
 */
export const makeIsExpandable =
  (fnAccessor: () => IsExpandableFn) =>
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
        getDefinitions(schema) !== null ||
        Object.keys(getSchemaDependencies(schema)).length > 0 ||
        hasKeyword(schema, "$recursiveAnchor") ||
        hasKeyword(schema, "$recursiveRef")
    )
  }

/**
 * Registered selectors are called as `selector(state, ...args)`. This hands
 * the system to a selector that reads other selectors through it (a copy of
 * the oas31 helper, so that the plugins stay independent).
 */
export const createSystemSelector =
  <State, Args extends unknown[], System, Result>(
    selector: (state: State, system: System, ...args: Args) => Result
  ) =>
  (state: State, ...args: Args) =>
  (system: System): Result =>
    selector(state, system, ...args)

/**
 * The number formats OpenAPI defines for its Schema Object dialect
 * (https://spec.openapis.org/oas/v3.1.1.html#data-type-format). JSON Schema
 * 2020-12 defines none of them, so in a JSON Schema document they imply no
 * type: neither `integer`/`number`, as the json-schema-2020-12 renderer infers
 * for OpenAPI, nor `string`, as it infers from any other `format`.
 */
export const OPENAPI_NUMBER_FORMATS: readonly string[] = [
  "int32",
  "int64",
  "float",
  "double",
]

const SIMPLE_TYPES = [
  "null",
  "boolean",
  "object",
  "array",
  "number",
  "integer",
  "string",
]

/**
 * The keywords of JSON Schema 2020-12 (and the `$recursiveRef` and
 * `dependencies` its default meta-schema keeps) that can make an instance
 * invalid. Any other keyword is an annotation or unknown, and "implementations
 * SHOULD treat unknown keywords as annotations"
 * (https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-01.html#section-6.5),
 * which includes `$$ref`, the annotation swagger-client adds to a schema it
 * resolved.
 */
const RESTRICTING_KEYWORDS = new Set([
  "$ref",
  "$dynamicRef",
  "$recursiveRef",
  "allOf",
  "anyOf",
  "oneOf",
  "not",
  "if",
  "then",
  "else",
  "dependentSchemas",
  "dependencies",
  "prefixItems",
  "items",
  "contains",
  "properties",
  "patternProperties",
  "additionalProperties",
  "propertyNames",
  "unevaluatedItems",
  "unevaluatedProperties",
  "type",
  "enum",
  "const",
  "multipleOf",
  "maximum",
  "exclusiveMaximum",
  "minimum",
  "exclusiveMinimum",
  "maxLength",
  "minLength",
  "pattern",
  "maxItems",
  "minItems",
  "uniqueItems",
  "maxContains",
  "minContains",
  "maxProperties",
  "minProperties",
  "required",
  "dependentRequired",
])

/**
 * Whether a schema is `true` or has no keyword that can restrict an instance:
 * every instance is valid against it, so an instance is never valid against
 * its `not`. It is conservative: a schema with a restricting keyword is not
 * known to be unrestricted, whatever it accepts in the end.
 */
const isUnrestricted = (schema: unknown): boolean =>
  schema === true ||
  (isObject(schema) &&
    !Object.keys(schema).some((keyword) => RESTRICTING_KEYWORDS.has(keyword)))

/**
 * The type label shown in a schema's head. A copy of `makeGetType` of the
 * json-schema-2020-12 renderer (plugins don't import each other; keep the two
 * in step), except that a schema without `type` infers no type from the
 * OpenAPI number formats (`OPENAPI_NUMBER_FORMATS`), and that `not` makes a
 * schema `never` only for a schema that has no restricting keyword
 * (`isUnrestricted`), where the renderer takes any `not` whose type label is
 * `any` (and leaves such a schema marked as seen, so that a second use of it
 * is taken for a cycle).
 * `fnAccessor` returns the `fn` of the renderer instance.
 */
export const makeGetType = (fnAccessor: () => InstanceFn) => {
  const getType = (
    schema: Schema,
    processedSchemas: WeakSet<object> = new WeakSet()
  ): string => {
    const fn = fnAccessor()

    if (schema == null) {
      return "any"
    }

    if (fn.isBooleanJSONSchema(schema)) {
      return schema ? "any" : "never"
    }

    if (typeof schema !== "object") {
      return "any"
    }

    if (processedSchemas.has(schema)) {
      return "any" // detect a cycle
    }
    processedSchemas.add(schema)

    const { type, prefixItems, items } = schema

    const getArrayType = () => {
      if (Array.isArray(prefixItems)) {
        const prefixItemsTypes = prefixItems.map((itemSchema) =>
          getType(itemSchema, processedSchemas)
        )
        const itemsType = items
          ? getType(items as Schema, processedSchemas)
          : "any"
        return `array<[${prefixItemsTypes.join(", ")}], ${itemsType}>`
      } else if (items) {
        const itemsType = getType(items as Schema, processedSchemas)
        return `array<${itemsType}>`
      } else {
        return "array<any>"
      }
    }

    const inferType = () => {
      if (
        Object.hasOwn(schema, "prefixItems") ||
        Object.hasOwn(schema, "items") ||
        Object.hasOwn(schema, "contains")
      ) {
        return getArrayType()
      } else if (
        Object.hasOwn(schema, "properties") ||
        Object.hasOwn(schema, "additionalProperties") ||
        Object.hasOwn(schema, "patternProperties")
      ) {
        return "object"
      } else if (
        Object.hasOwn(schema, "minimum") ||
        Object.hasOwn(schema, "maximum") ||
        Object.hasOwn(schema, "exclusiveMinimum") ||
        Object.hasOwn(schema, "exclusiveMaximum") ||
        Object.hasOwn(schema, "multipleOf")
      ) {
        return "number | integer"
      } else if (
        Object.hasOwn(schema, "pattern") ||
        (Object.hasOwn(schema, "format") &&
          !OPENAPI_NUMBER_FORMATS.includes(schema.format as string)) ||
        Object.hasOwn(schema, "minLength") ||
        Object.hasOwn(schema, "maxLength") ||
        Object.hasOwn(schema, "contentEncoding") ||
        Object.hasOwn(schema, "contentMediaType")
      ) {
        return "string"
      } else if (typeof schema.const !== "undefined") {
        if (schema.const === null) {
          return "null"
        } else if (typeof schema.const === "boolean") {
          return "boolean"
        } else if (typeof schema.const === "number") {
          return Number.isInteger(schema.const) ? "integer" : "number"
        } else if (typeof schema.const === "string") {
          return "string"
        } else if (Array.isArray(schema.const)) {
          return "array<any>"
        } else if (typeof schema.const === "object") {
          return "object"
        }
      }
      return null
    }

    if (isUnrestricted(schema.not)) {
      // not a cycle: the schema may be used again, so it isn't left marked
      processedSchemas.delete(schema)
      return "never"
    }

    const typeString = Array.isArray(type)
      ? type.map((t) => (t === "array" ? getArrayType() : t)).join(" | ")
      : type === "array"
        ? getArrayType()
        : SIMPLE_TYPES.includes(type as string)
          ? (type as string)
          : inferType()

    const handleCombiningKeywords = (keyword: string, separator: string) => {
      const subschemas = schema[keyword]
      if (Array.isArray(subschemas)) {
        const combinedTypes = subschemas.map((subSchema) =>
          getType(subSchema, processedSchemas)
        )
        return `(${combinedTypes.join(separator)})`
      }
      return null
    }

    const oneOfString = handleCombiningKeywords("oneOf", " | ")
    const anyOfString = handleCombiningKeywords("anyOf", " | ")
    const allOfString = handleCombiningKeywords("allOf", " & ")

    const combinedStrings = [typeString, oneOfString, anyOfString, allOfString]
      .filter(Boolean)
      .join(" | ")

    processedSchemas.delete(schema)

    return combinedStrings || "any"
  }

  return getType
}

const TITLE_KEYS = ["title", "$anchor", "$id"] as const

/**
 * The name of a document: its `title`, else `$anchor`, else `$id` (as the
 * json-schema-2020-12 renderer names a schema), else the name of the dialect.
 */
export const getDocumentTitle = (
  spec: ImmutableMap<string, unknown>,
  dialectName: string
): string => {
  for (const key of TITLE_KEYS) {
    const value = spec.get(key)
    if (typeof value === "string" && value !== "") {
      return value
    }
  }

  return dialectName
}

/**
 * The URI the document was retrieved from, absolute, without the fragment of
 * the page (the resolver's base doesn't have it either). For a document that
 * wasn't retrieved (loaded from a `spec` object or string) it is the URI of the
 * page, the default base URI the resolver uses, not a retrieval URI: the
 * caller shows it as one only for a non-empty `url`. `null` when no absolute
 * URI can be built.
 */
export const getRetrievalURI = (
  url: string | undefined,
  documentBaseURI: string | undefined
): string | null => {
  try {
    return new URL(url || "", documentBaseURI).toString()
  } catch {
    return null
  }
}

/**
 * The base URI of the document: its `$id` resolved against the retrieval URI
 * (https://json-schema.org/draft/2020-12/json-schema-core#name-base-uri),
 * the retrieval URI when there's no `$id`, `null` when neither is an absolute
 * URI. An empty fragment is dropped: the absolute-URI form "MUST be considered
 * the canonical URI, regardless of the presence or absence of an empty
 * fragment" (core, 8.2.1).
 */
export const getBaseURI = (
  spec: ImmutableMap<string, unknown>,
  retrievalURI: string | null
): string | null => {
  const $id = spec.get("$id")
  if (typeof $id !== "string" || $id === "") return retrievalURI

  try {
    const uri =
      retrievalURI === null ? new URL($id) : new URL($id, retrievalURI)
    if (uri.hash === "") uri.hash = ""

    return uri.toString()
  } catch {
    return retrievalURI
  }
}
