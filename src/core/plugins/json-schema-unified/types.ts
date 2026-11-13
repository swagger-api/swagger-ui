/**
 * @prettier
 */
import type React from "react"

/**
 * A JSON Schema object. The known keywords are typed loosely; every other
 * keyword (extensions, keywords of other dialects) is `unknown`.
 */
export interface SchemaObject {
  // core vocabulary
  $schema?: string
  $vocabulary?: Record<string, boolean>
  $id?: string
  $anchor?: string
  $dynamicAnchor?: string
  $ref?: string
  $dynamicRef?: string
  $defs?: Record<string, SchemaObject | boolean>
  $comment?: string
  // applicator vocabulary
  allOf?: (SchemaObject | boolean)[]
  anyOf?: (SchemaObject | boolean)[]
  oneOf?: (SchemaObject | boolean)[]
  not?: SchemaObject | boolean
  if?: SchemaObject | boolean
  then?: SchemaObject | boolean
  else?: SchemaObject | boolean
  dependentSchemas?: Record<string, SchemaObject | boolean>
  prefixItems?: (SchemaObject | boolean)[]
  items?: SchemaObject | boolean
  contains?: SchemaObject | boolean
  properties?: Record<string, SchemaObject | boolean>
  patternProperties?: Record<string, SchemaObject | boolean>
  additionalProperties?: SchemaObject | boolean
  propertyNames?: SchemaObject | boolean
  // unevaluated locations vocabulary
  unevaluatedItems?: SchemaObject | boolean
  unevaluatedProperties?: SchemaObject | boolean
  // validation vocabulary
  type?: string | string[]
  enum?: unknown[]
  const?: unknown
  multipleOf?: number
  maximum?: number
  exclusiveMaximum?: number
  minimum?: number
  exclusiveMinimum?: number
  maxLength?: number
  minLength?: number
  pattern?: string
  maxItems?: number
  minItems?: number
  uniqueItems?: boolean
  maxContains?: number
  minContains?: number
  maxProperties?: number
  minProperties?: number
  required?: string[]
  dependentRequired?: Record<string, string[]>
  // meta-data annotations vocabulary
  title?: string
  description?: string
  default?: unknown
  deprecated?: boolean
  readOnly?: boolean
  writeOnly?: boolean
  examples?: unknown[]
  // format and content vocabularies
  format?: string
  contentEncoding?: string
  contentMediaType?: string
  contentSchema?: SchemaObject | boolean
  [keyword: string]: unknown
}

/**
 * A JSON Schema: an object or a boolean schema.
 */
export type Schema = SchemaObject | boolean

/**
 * Props every keyword component receives. `schema` is the schema that
 * carries the keyword; it may be a boolean schema.
 */
export interface KeywordProps {
  schema: Schema
}

export interface Constraint {
  scope: "number" | "string" | "array" | "object"
  value: string
}

export type GetTitle = (
  schema: Schema,
  options?: { lookup?: "basic" | "extended" }
) => string

/**
 * Returns the properties of `schema` a renderer instance shows. The OAS
 * dialects filter `readOnly`/`writeOnly` properties by the instance config.
 */
export type GetProperties = (
  schema: Schema,
  config: { includeReadOnly?: boolean; includeWriteOnly?: boolean }
) => Record<string, Schema>

/**
 * A local reference the resolver left in place (2.0/3.0 cycles) and the
 * named schema it points to. `key` identifies the target (its name).
 */
export interface LazyRef {
  key: string
  definition: SchemaObject
}

export type GetType = (
  schema: Schema,
  processedSchemas?: WeakSet<object>
) => string

/**
 * Helpers available through `useFn()` in a renderer instance. Overrides
 * passed to the HOCs may add more.
 */
export interface JSONSchemaFn {
  upperFirst: <T>(value: T) => T | string
  getTitle: GetTitle
  getType: GetType
  isBooleanJSONSchema: (schema: unknown) => schema is boolean
  hasKeyword: (schema: unknown, keyword: string) => schema is SchemaObject
  isExpandable: (schema: Schema) => boolean
  stringify: (value: unknown) => string
  stringifyConstraints: (schema: Schema) => Constraint[]
  getDependentRequired: (propertyName: string, schema: Schema) => string[]
  getSchemaKeywords: () => string[]
  getExtensionKeywords: (schema: Schema) => string[]
  /** Set by the OAS dialects (`./dialects`); absent means "all properties". */
  getProperties?: GetProperties
  /**
   * Set by the 2.0/3.0 dialects: the definition an unresolved local `$ref`
   * points to, rendered in its place (see `./legacy`).
   */
  getLazyRef?: (schema: Schema) => LazyRef | null
  /** Set by the 2.0/3.0 dialects: the reference path of a dereferenced schema. */
  getRefPath?: (schema: Schema) => string
  getSchemaName?: (schema: Schema) => string
  [name: string]: unknown
}

export type FnAccessor = () => JSONSchemaFn

export interface JSONSchemaConfig {
  /** `undefined` in the 2.0/3.0 dialects, which have no dialect id. */
  default$schema: string | undefined
  defaultExpandedLevels: number
  showExtensionKeywords: boolean
  /** OAS dialects: show `readOnly: true` properties. */
  includeReadOnly?: boolean
  /** OAS dialects: show `writeOnly: true` properties. */
  includeWriteOnly?: boolean
  [name: string]: unknown
}

export type ComponentMap = Record<
  string,
  React.ComponentType<Record<string, unknown>>
>

export interface JSONSchemaContextValue {
  components: ComponentMap
  config: JSONSchemaConfig
  fn: JSONSchemaFn
  state: { paths: Record<string, string> }
}

export interface JSONSchemaOverrides {
  components?: ComponentMap
  config?: Partial<JSONSchemaConfig>
  fn?: Partial<JSONSchemaFn>
}

/**
 * OpenAPI Schema Object fixed fields (OAS 3.1 / 3.2), read from a schema with
 * `toSchemaObject(schema).<field>` and checked with `isPlainObject` first.
 */
export interface OASDiscriminator {
  propertyName?: string
  mapping?: Record<string, string>
  [extension: string]: unknown
}

export interface OASXml {
  name?: string
  namespace?: string
  prefix?: string
  attribute?: boolean
  wrapped?: boolean
  [extension: string]: unknown
}

export interface OASExternalDocs {
  description?: string
  url?: string
  [extension: string]: unknown
}
