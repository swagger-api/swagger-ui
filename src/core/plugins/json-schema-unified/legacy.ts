/**
 * @prettier
 */
import {
  difference,
  hasKeyword,
  isPlainObject,
  stringifyConstraints,
  toSchemaObject,
  upperFirst,
} from "./fn"
import type {
  Constraint,
  GetProperties,
  GetTitle,
  GetType,
  LazyRef,
  Schema,
  SchemaObject,
} from "./types"

/**
 * The OpenAPI 2.0 and 3.0 dialects of the unified renderer. Their Schema
 * Objects are an extended subset of JSON Schema draft 4/5 (wright-00), so
 * several keywords differ in shape or meaning from 2020-12; the helpers here
 * implement those differences for one renderer instance (see
 * `./dialects#getOASDialectOverrides`).
 */
export type LegacyDialect = "swagger2" | "oas30"

export const LEGACY_DIALECTS: ReadonlyArray<LegacyDialect> = Object.freeze([
  "swagger2",
  "oas30",
])

export const isLegacyDialect = (dialect: unknown): dialect is LegacyDialect =>
  LEGACY_DIALECTS.includes(dialect as LegacyDialect)

/**
 * The fixed fields of the OpenAPI 2.0 Schema Object, plus the internal
 * `$$ref` (added by dereferencing). Every other field (2020-12-only keywords
 * such as `const` or `$defs` included) is an extension keyword.
 */
export const SWAGGER2_SCHEMA_KEYWORDS: ReadonlyArray<string> = Object.freeze([
  "$ref",
  "format",
  "title",
  "description",
  "default",
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
  "maxProperties",
  "minProperties",
  "required",
  "enum",
  "type",
  "items",
  "allOf",
  "properties",
  "additionalProperties",
  "discriminator",
  "readOnly",
  "xml",
  "externalDocs",
  "example",
  // $$ref is an internal keyword used for dereferencing
  "$$ref",
])

/**
 * The fixed fields of the OpenAPI 3.0 Schema Object (and the Reference
 * Object's `$ref`), plus the internal `$$ref`.
 */
export const OAS30_SCHEMA_KEYWORDS: ReadonlyArray<string> = Object.freeze([
  "$ref",
  "title",
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
  "maxProperties",
  "minProperties",
  "required",
  "enum",
  "type",
  "allOf",
  "oneOf",
  "anyOf",
  "not",
  "items",
  "properties",
  "additionalProperties",
  "description",
  "format",
  "default",
  "nullable",
  "discriminator",
  "readOnly",
  "writeOnly",
  "xml",
  "externalDocs",
  "example",
  "deprecated",
  // $$ref is an internal keyword used for dereferencing
  "$$ref",
])

export const LEGACY_SCHEMA_KEYWORDS: Readonly<
  Record<LegacyDialect, ReadonlyArray<string>>
> = Object.freeze({
  swagger2: SWAGGER2_SCHEMA_KEYWORDS,
  oas30: OAS30_SCHEMA_KEYWORDS,
})

/**
 * The `type` values each dialect knows; any other value is ignored and the
 * type is inferred, as in 2020-12. 2.0 adds `file`.
 */
const LEGACY_TYPES: Readonly<Record<LegacyDialect, ReadonlyArray<string>>> =
  Object.freeze({
    swagger2: Object.freeze([
      "boolean",
      "object",
      "array",
      "number",
      "integer",
      "string",
      "file",
    ]),
    oas30: Object.freeze([
      "boolean",
      "object",
      "array",
      "number",
      "integer",
      "string",
    ]),
  })

/**
 * Where a dialect's local references point to: `#/definitions/<name>` (2.0)
 * or `#/components/schemas/<name>` (3.0).
 */
const LOCAL_REF_PREFIXES: Readonly<Record<LegacyDialect, string>> =
  Object.freeze({
    swagger2: "/definitions/",
    oas30: "/components/schemas/",
  })

/**
 * One JSON-pointer reference token of a URI fragment: percent-decoded, then
 * `~1` -> `/` and `~0` -> `~` (RFC 6901, sections 4 and 6).
 */
export const decodePointerToken = (token: string): string => {
  let decoded = token
  try {
    decoded = decodeURIComponent(token)
  } catch {
    // keep the raw token
  }
  return decoded.replace(/~1/g, "/").replace(/~0/g, "~")
}

const getFragment = (ref: unknown): string | null => {
  if (typeof ref !== "string") return null
  const index = ref.indexOf("#")
  return index === -1 ? null : ref.slice(index + 1)
}

/**
 * The name a reference gives the schema it points to: the last token of its
 * JSON-pointer fragment, decoded (`#/definitions/Foo~1Bar` -> `Foo/Bar`).
 * Empty when the reference has no fragment or the pointer is empty.
 */
export const getRefSchemaName = (ref: unknown): string => {
  const fragment = getFragment(ref)
  if (!fragment) return ""

  const tokens = fragment.split("/")
  return decodePointerToken(tokens[tokens.length - 1])
}

/**
 * The named schema a local reference points to (`#/definitions/<name>` for
 * 2.0, `#/components/schemas/<name>` for 3.0), decoded; `null` for any other
 * reference. As in json-schema-5, the document part of the reference is not
 * compared (the resolver makes same-document references absolute).
 */
export const getLocalRefName = (
  ref: unknown,
  dialect: LegacyDialect
): string | null => {
  const fragment = getFragment(ref)
  const prefix = LOCAL_REF_PREFIXES[dialect]
  if (!fragment || !fragment.startsWith(prefix)) return null

  const token = fragment.slice(prefix.length)
  if (token === "" || token.includes("/")) return null
  return decodePointerToken(token)
}

/**
 * `overlay` deep-merged over `base` (json-schema-5's `refSchema.mergeDeep`):
 * objects merge key by key, `required` lists are united, any other value of
 * `overlay` wins.
 */
const mergeSchemas = (base: unknown, overlay: unknown): unknown => {
  if (!isPlainObject(base) || !isPlainObject(overlay)) return overlay

  const merged: Record<string, unknown> = { ...base }
  Object.entries(overlay).forEach(([key, value]) => {
    if (
      key === "required" &&
      Array.isArray(base.required) &&
      Array.isArray(value)
    ) {
      merged.required = Array.from(new Set([...base.required, ...value]))
    } else {
      merged[key] = Object.hasOwn(base, key)
        ? mergeSchemas(base[key], value)
        : value
    }
  })
  return merged
}

/**
 * The schema a lazily resolved reference renders: the referenced definition
 * with the reference's siblings merged over it (they are what the resolver
 * left there, e.g. a merged `allOf`), without `$ref`, and with `$$ref` set to
 * the reference when it has none, as json-schema-5's `Model` does.
 */
export const mergeLazyRef = (
  definition: SchemaObject,
  schema: SchemaObject
): SchemaObject => {
  const { $ref, ...siblings } = schema
  const merged = mergeSchemas(definition, siblings) as SchemaObject
  if (merged.$$ref == null && typeof $ref === "string") {
    merged.$$ref = $ref
  }
  return merged
}

/** Numeric bounds (rewritten below) and 2020-12-only constraint keywords. */
const REWRITTEN_CONSTRAINT_KEYWORDS = [
  "maximum",
  "exclusiveMaximum",
  "minimum",
  "exclusiveMinimum",
  "minContains",
  "maxContains",
  "contentMediaType",
  "contentEncoding",
]

/**
 * Constraints with the draft 4 meaning of `exclusiveMaximum` /
 * `exclusiveMinimum` (booleans that make `maximum` / `minimum` exclusive),
 * rewritten into the 2020-12 numeric form before formatting, so
 * `maximum: 10, exclusiveMaximum: true` reads `< 10` as in 2020-12. Keywords
 * these dialects lack (`minContains`, `contentMediaType`, ...) are dropped.
 */
export const stringifyLegacyConstraints = (schema: Schema): Constraint[] => {
  if (!isPlainObject(schema)) return stringifyConstraints(schema)

  const { maximum, exclusiveMaximum, minimum, exclusiveMinimum } =
    schema as SchemaObject
  const normalized: SchemaObject = { ...schema }
  REWRITTEN_CONSTRAINT_KEYWORDS.forEach((keyword) => {
    delete normalized[keyword]
  })

  if (typeof maximum === "number") {
    if ((exclusiveMaximum as unknown) === true) {
      normalized.exclusiveMaximum = maximum
    } else {
      normalized.maximum = maximum
    }
  }
  if (typeof minimum === "number") {
    if ((exclusiveMinimum as unknown) === true) {
      normalized.exclusiveMinimum = minimum
    } else {
      normalized.minimum = minimum
    }
  }

  return stringifyConstraints(normalized)
}

export interface LegacyDialectInputs {
  /** The named schema `name` of the document (see `./schemas#findSchemaDefinition`). */
  findSchema?: (name: string) => Schema | null
  /** The absolute URL of the document; references into it show as `#/...`. */
  getDocumentUrl?: () => string
}

export type LegacyDialectFn = {
  getSchemaKeywords: () => string[]
  getProperties: GetProperties
  isExpandable: (schema: Schema) => boolean
  getType: GetType
  getTitle: GetTitle
  stringifyConstraints: (schema: Schema) => Constraint[]
  getDependentRequired: () => string[]
  getLazyRef: (schema: Schema) => LazyRef | null
  getRefPath: (schema: Schema) => string
  getSchemaName: (schema: Schema) => string
}

/**
 * The `fn` overrides of a 2.0 or 3.0 renderer instance.
 */
export const makeLegacyDialectFn = (
  dialect: LegacyDialect,
  { findSchema, getDocumentUrl }: LegacyDialectInputs = {}
): LegacyDialectFn => {
  const keywords = LEGACY_SCHEMA_KEYWORDS[dialect]
  const types = LEGACY_TYPES[dialect]
  const isKeyword = (keyword: string) => keywords.includes(keyword)
  const has = (schema: Schema, keyword: string) =>
    isKeyword(keyword) && hasKeyword(schema, keyword)

  /**
   * A local `$ref` the resolver left in place (a cycle) and the definition it
   * points to, looked up when the schema renders. Since a schema's body only
   * renders when it is expanded, the recursion is bounded by the user's
   * expansion.
   */
  const getLazyRef = (schema: Schema): LazyRef | null => {
    if (!findSchema) return null
    const { $ref } = toSchemaObject(schema)
    const name = getLocalRefName($ref, dialect)
    if (name === null) return null

    const definition = findSchema(name)
    return isPlainObject(definition)
      ? { key: name, definition: definition as SchemaObject }
      : null
  }

  const getProperties: GetProperties = (
    schema,
    { includeReadOnly, includeWriteOnly }
  ) => {
    const { properties } = toSchemaObject(schema)
    if (!isPlainObject(properties)) return {}

    return Object.fromEntries(
      Object.entries(properties).filter(([, value]) => {
        const isReadOnly = toSchemaObject(value).readOnly === true
        // honoured in 2.0 too, although not a 2.0 keyword, as json-schema-5 does
        const isWriteOnly = toSchemaObject(value).writeOnly === true

        return (
          (!isReadOnly || includeReadOnly) && (!isWriteOnly || includeWriteOnly)
        )
      })
    ) as Record<string, Schema>
  }

  const getExtensionKeywords = (schema: Schema): string[] =>
    isPlainObject(schema)
      ? difference(Object.keys(schema), keywords as string[])
      : []

  const isExpandable = (schema: Schema): boolean => {
    const schemaObject = toSchemaObject(schema)

    return Boolean(
      schemaObject.$ref ||
        schemaObject.allOf ||
        (isKeyword("anyOf") && schemaObject.anyOf) ||
        (isKeyword("oneOf") && schemaObject.oneOf) ||
        has(schema, "not") ||
        has(schema, "items") ||
        schemaObject.properties ||
        has(schema, "additionalProperties") ||
        schemaObject.description ||
        schemaObject.enum ||
        has(schema, "default") ||
        has(schema, "example") ||
        schemaObject.xml ||
        schemaObject.discriminator ||
        schemaObject.externalDocs ||
        getExtensionKeywords(schema).length > 0
    )
  }

  const getType: GetType = (schema, processedSchemas = new WeakSet()) => {
    if (schema == null) return "any"
    if (typeof schema === "boolean") return schema ? "any" : "never"
    if (typeof schema !== "object") return "any"
    if (processedSchemas.has(schema)) return "any" // detect a cycle

    const lazyRef = getLazyRef(schema)
    if (lazyRef) {
      if (processedSchemas.has(lazyRef.definition)) return "any"
      processedSchemas.add(lazyRef.definition)
      const type = getType(
        mergeLazyRef(lazyRef.definition, schema),
        processedSchemas
      )
      processedSchemas.delete(lazyRef.definition)
      return type
    }

    processedSchemas.add(schema)
    const { type, items } = schema

    const getArrayType = () =>
      has(schema, "items")
        ? `array<${getType(items, processedSchemas)}>`
        : "array<any>"

    const inferType = () => {
      if (has(schema, "items")) {
        return getArrayType()
      } else if (
        has(schema, "properties") ||
        has(schema, "additionalProperties")
      ) {
        return "object"
      } else if (["int32", "int64"].includes(schema.format)) {
        return "integer"
      } else if (["float", "double"].includes(schema.format)) {
        return "number"
      } else if (
        has(schema, "minimum") ||
        has(schema, "maximum") ||
        has(schema, "multipleOf")
      ) {
        return "number | integer"
      } else if (
        has(schema, "pattern") ||
        has(schema, "format") ||
        has(schema, "minLength") ||
        has(schema, "maxLength")
      ) {
        return "string"
      }
      return null
    }

    if (has(schema, "not") && getType(schema.not, processedSchemas) === "any") {
      processedSchemas.delete(schema)
      return "never"
    }

    const typeString = Array.isArray(type)
      ? type
          .map((t) => (t === "array" ? getArrayType() : String(t)))
          .join(" | ")
      : type === "array"
        ? getArrayType()
        : types.includes(type)
          ? type
          : inferType()

    const combine = (
      keyword: "oneOf" | "anyOf" | "allOf",
      separator: string
    ) =>
      isKeyword(keyword) && Array.isArray(schema[keyword])
        ? `(${schema[keyword]
            .map((subSchema) => getType(subSchema, processedSchemas))
            .join(separator)})`
        : null

    const combined = [
      typeString,
      combine("oneOf", " | "),
      combine("anyOf", " | "),
      combine("allOf", " & "),
    ]
      .filter(Boolean)
      .join(" | ")

    processedSchemas.delete(schema)

    const result = combined || "any"
    // 3.0 `nullable: true` reads like a 2020-12 `type: [..., "null"]`
    const isNullable =
      isKeyword("nullable") &&
      schema.nullable === true &&
      result !== "any" &&
      !result.split(" | ").includes("null")

    return isNullable ? `${result} | null` : result
  }

  /**
   * `title`, else (extended lookup) the name of the schema's `$$ref` or
   * `$ref`, as json-schema-5 names nested models. 2.0/3.0 have no `$anchor`
   * or `$id`.
   */
  const getTitle: GetTitle = (schema, { lookup = "extended" } = {}) => {
    const schemaObject = toSchemaObject(schema)

    if (schemaObject.title != null)
      return upperFirst(String(schemaObject.title))
    if (lookup === "extended") {
      return (
        getRefSchemaName(schemaObject.$$ref) ||
        getRefSchemaName(schemaObject.$ref)
      )
    }
    return ""
  }

  /**
   * The reference a dereferenced schema came from (`$$ref`), relative to the
   * document when it points into it (`#/definitions/Category`); empty when
   * the schema was not dereferenced.
   */
  const getRefPath = (schema: Schema): string => {
    const { $$ref } = toSchemaObject(schema)
    if (typeof $$ref !== "string" || $$ref === "") return ""

    const index = $$ref.indexOf("#")
    if (index === -1) return $$ref
    const documentPart = $$ref.slice(0, index)
    const documentUrl = getDocumentUrl?.() ?? ""
    return documentPart === "" || documentPart === documentUrl
      ? $$ref.slice(index)
      : $$ref
  }

  return {
    getSchemaKeywords: () => [...keywords],
    getProperties,
    isExpandable,
    getType,
    getTitle,
    stringifyConstraints: stringifyLegacyConstraints,
    // `dependentRequired` is a 2019-09 keyword
    getDependentRequired: () => [],
    getLazyRef,
    getRefPath,
    getSchemaName: (schema: Schema) => getTitle(schema),
  }
}
