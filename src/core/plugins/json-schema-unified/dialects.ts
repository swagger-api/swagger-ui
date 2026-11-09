/**
 * @prettier
 */
import {
  getSchemaKeywords,
  hasKeyword,
  makeIsExpandable,
  toSchemaObject,
} from "./fn"
import { useFn } from "./hooks"
import {
  DescriptionSlot,
  ExamplesSlot,
  PropertiesSlot,
  Swagger2DiscriminatorSlot,
} from "./components/keywords/oas/slots"
import Unsupported from "./components/keywords/Unsupported"
import { isLegacyDialect, makeLegacyDialectFn } from "./legacy"
import type { LegacyDialect, LegacyDialectInputs } from "./legacy"
import type {
  ComponentMap,
  GetProperties,
  JSONSchemaConfig,
  JSONSchemaFn,
  Schema,
} from "./types"

/**
 * OpenAPI dialects of the unified renderer.
 *
 * A dialect is a set of per-instance HOC overrides, the equivalent of what the
 * oas31/oas32 plugins do globally today (Model/Models wrappers, after-load
 * mutations of `fn.jsonSchema202012`, and wrapComponents of the Description,
 * Examples and Properties keywords). Nothing here mutates shared state: every
 * call returns fresh objects for one renderer instance.
 *
 * `swagger2` and `oas30` (`./legacy`) have their own keyword lists and the
 * keyword semantics of their draft-4-based Schema Objects.
 */
export type OASDialect = "oas31" | "oas32" | LegacyDialect

export const OAS_DIALECTS: ReadonlyArray<OASDialect> = Object.freeze([
  "oas32",
  "oas31",
  "oas30",
  "swagger2",
])

/**
 * `default$schema` per dialect. OAS 3.2 uses its published dialect id, not
 * the OAS 3.2 document-schema id (`.../oas/3.2/schema/2025-09-17`) that the
 * oas32 Model/Models wrappers pass to json-schema-2020-12. OAS 2.0 and 3.0
 * define no dialect id for their Schema Objects, so those instances get
 * none (`default$schema` is `undefined`; no renderer reads it).
 */
export const OAS_DIALECT_SCHEMAS: Readonly<
  Partial<Record<OASDialect, string>>
> = Object.freeze({
  oas31: "https://spec.openapis.org/oas/3.1/dialect/base",
  oas32: "https://spec.openapis.org/oas/3.2/dialect/2025-09-17",
})

/**
 * The 2020-12 keyword components 2.0 and 3.0 have no keyword for. Their
 * slots render nothing, so such keywords show as extension keywords.
 */
const NON_LEGACY_KEYWORD_COMPONENTS = [
  "Keyword$schema",
  "Keyword$vocabulary",
  "Keyword$id",
  "Keyword$anchor",
  "Keyword$dynamicAnchor",
  "Keyword$dynamicRef",
  "Keyword$defs",
  "Keyword$comment",
  "KeywordIf",
  "KeywordThen",
  "KeywordElse",
  "KeywordDependentSchemas",
  "KeywordPrefixItems",
  "KeywordContains",
  "KeywordPatternProperties",
  "KeywordPropertyNames",
  "KeywordUnevaluatedItems",
  "KeywordUnevaluatedProperties",
  "KeywordConst",
  "KeywordDependentRequired",
  "KeywordContentSchema",
]

/** ... and the 3.0 keywords 2.0 lacks (`allOf` is its only combiner). */
const NON_SWAGGER2_KEYWORD_COMPONENTS = [
  "KeywordAnyOf",
  "KeywordOneOf",
  "KeywordNot",
  "KeywordWriteOnly",
  "KeywordDeprecated",
]

const unsupportedComponents = (names: string[]): ComponentMap =>
  Object.fromEntries(names.map((name) => [name, Unsupported])) as ComponentMap

export interface OASDialectOptions extends LegacyDialectInputs {
  /** Show `readOnly: true` properties; `undefined` hides them (as oas31's Model wrapper does). */
  includeReadOnly?: boolean
  /** Show `writeOnly: true` properties; `undefined` hides them (as oas31's Model wrapper does). */
  includeWriteOnly?: boolean
  /** `config.defaultExpandedLevels`; omitted -> the HOC default (0). */
  defaultExpandedLevels?: number
  /** `config.showExtensionKeywords`; omitted -> the HOC default (system HOC: `configs.showExtensions`). */
  showExtensions?: boolean
}

export interface OASDialectOverrides {
  config: Partial<JSONSchemaConfig>
  fn: Partial<JSONSchemaFn>
  components: ComponentMap
}

/**
 * The 2020-12 keywords plus the OpenAPI Schema Object fixed fields and the
 * internal `$$ref` (added by dereferencing), so none of them is rendered as
 * an extension keyword.
 */
export const getOASSchemaKeywords = (): string[] => [
  ...getSchemaKeywords(),
  "discriminator",
  "xml",
  "externalDocs",
  "example",
  // $$ref is an internal keyword used for dereferencing
  "$$ref",
]

/**
 * `properties` without the `readOnly: true` / `writeOnly: true` properties
 * the config excludes.
 */
export const getOASProperties: GetProperties = (
  schema,
  { includeReadOnly, includeWriteOnly }
) => {
  const { properties } = toSchemaObject(schema)
  if (!properties) return {}

  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) => {
      const isReadOnly = toSchemaObject(value).readOnly === true
      const isWriteOnly = toSchemaObject(value).writeOnly === true

      return (
        (!isReadOnly || includeReadOnly) && (!isWriteOnly || includeWriteOnly)
      )
    })
  )
}

/**
 * 2020-12 `isExpandable` (computed with the instance's `fn`, so its keyword
 * list is the OAS one) or any OpenAPI keyword.
 */
const isExpandable2020 = makeIsExpandable(useFn)

export const isOASExpandable = (schema: Schema): boolean => {
  const schemaObject = toSchemaObject(schema)

  return (
    isExpandable2020(schema) ||
    hasKeyword(schema, "example") ||
    Boolean(
      schemaObject.xml ||
        schemaObject.discriminator ||
        schemaObject.externalDocs
    )
  )
}

/**
 * Returns the overrides for `withJSONSchemaUnifiedSystemContext(Component,
 * overrides)` (or `withJSONSchemaUnifiedContext`) that make the instance
 * render an OpenAPI 3.1 or 3.2 Schema Object:
 *
 * - `config`: the dialect's `default$schema`, `includeReadOnly` and
 *   `includeWriteOnly` (as booleans), plus `defaultExpandedLevels` and
 *   `showExtensionKeywords` when given;
 * - `fn`: `getSchemaKeywords` (OAS list, `$$ref` included), `getProperties`
 *   (readOnly/writeOnly filtering) and `isExpandable` (OAS keywords count);
 * - `components`: the `KeywordDescription`, `KeywordExamples` and
 *   `KeywordProperties` slots render the instance's `KeywordOASDescription`
 *   (markdown via the system `Markdown`), `KeywordOASExamples` (examples,
 *   discriminator, xml, externalDocs, example) and `KeywordOASProperties`.
 *
 * oas31 and oas32 differ only in `default$schema`. `swagger2` and `oas30` get
 * their own `fn` (`./legacy#makeLegacyDialectFn`: keyword list, types,
 * boolean exclusive bounds, nested names, lazily resolved `$ref`s, reference
 * paths) and render nothing for the keywords they lack (2.0's `discriminator`
 * is a property-name string). `findSchema` and `getDocumentUrl` feed their
 * `$ref` lookup and reference paths.
 */
export const getOASDialectOverrides = (
  dialect: OASDialect,
  {
    includeReadOnly,
    includeWriteOnly,
    defaultExpandedLevels,
    showExtensions,
    findSchema,
    getDocumentUrl,
  }: OASDialectOptions = {}
): OASDialectOverrides => {
  if (!OAS_DIALECTS.includes(dialect)) {
    throw new TypeError(`Unknown OpenAPI dialect: ${String(dialect)}`)
  }

  const config: Partial<JSONSchemaConfig> = {
    default$schema: OAS_DIALECT_SCHEMAS[dialect],
    includeReadOnly: Boolean(includeReadOnly),
    includeWriteOnly: Boolean(includeWriteOnly),
  }
  if (typeof defaultExpandedLevels === "number") {
    config.defaultExpandedLevels = defaultExpandedLevels
  }
  if (typeof showExtensions === "boolean") {
    config.showExtensionKeywords = showExtensions
  }

  const slots: ComponentMap = {
    KeywordDescription: DescriptionSlot,
    KeywordExamples: ExamplesSlot,
    KeywordProperties: PropertiesSlot,
  }

  if (isLegacyDialect(dialect)) {
    return {
      config,
      fn: makeLegacyDialectFn(dialect, { findSchema, getDocumentUrl }),
      components: {
        ...unsupportedComponents(
          dialect === "swagger2"
            ? [
                ...NON_LEGACY_KEYWORD_COMPONENTS,
                ...NON_SWAGGER2_KEYWORD_COMPONENTS,
              ]
            : NON_LEGACY_KEYWORD_COMPONENTS
        ),
        ...slots,
        ...(dialect === "swagger2"
          ? { KeywordDiscriminator: Swagger2DiscriminatorSlot }
          : {}),
      },
    }
  }

  return {
    config,
    fn: {
      getSchemaKeywords: getOASSchemaKeywords,
      getProperties: getOASProperties,
      isExpandable: isOASExpandable,
    },
    components: slots,
  }
}
