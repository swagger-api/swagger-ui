/**
 * @prettier
 */
import { isImmutable, Map as ImMap } from "immutable"

import type { OASDialect } from "./dialects"
import type { Schema } from "./types"

/**
 * Where each dialect's documents keep their named schemas. This is also the
 * layout key of the Schemas section (expansion, scroll, deep links), as in
 * json-schema-5's Models: `["definitions"]` for 2.0, `["components",
 * "schemas"]` for 3.x.
 */
export const SCHEMAS_PATHS: Readonly<Record<OASDialect, readonly string[]>> =
  Object.freeze({
    swagger2: Object.freeze(["definitions"]),
    oas30: Object.freeze(["components", "schemas"]),
    oas31: Object.freeze(["components", "schemas"]),
    oas32: Object.freeze(["components", "schemas"]),
  })

/** The heading of the named-schemas section: "Models" for 2.0, "Schemas" for 3.x. */
export const SCHEMAS_HEADINGS: Readonly<Record<OASDialect, string>> =
  Object.freeze({
    swagger2: "Models",
    oas30: "Schemas",
    oas31: "Schemas",
    oas32: "Schemas",
  })

export const getSchemasPath = (dialect: OASDialect): string[] => [
  ...SCHEMAS_PATHS[dialect],
]

/**
 * Immutable value -> plain JS, converted once per Immutable object. Immutable
 * values are persistent, so an object's plain copy never goes stale; the
 * `WeakMap` lets it go with the Immutable object. Non-Immutable values are
 * returned as they are.
 */
const plainCache = new WeakMap<object, unknown>()

export const toPlainSchema = (value: unknown): Schema => {
  if (!isImmutable(value)) return value as Schema

  const key = value as object
  if (!plainCache.has(key)) {
    plainCache.set(key, (value as { toJS: () => unknown }).toJS())
  }
  return plainCache.get(key) as Schema
}

export type SchemaEntry = [name: string, schema: Schema]

export interface SchemasSpecSelectors {
  specJson: () => unknown
  specResolvedSubtree: (path: string[]) => unknown
}

const EMPTY_ENTRIES: SchemaEntry[] = []

/**
 * The last entries computed for a raw schemas collection, with the resolved
 * collection they were computed from. Recomputed only when either changes.
 */
const entriesCache = new WeakMap<
  object,
  { resolved: unknown; entries: SchemaEntry[] }
>()

/**
 * The named schemas of the current document, in document order, as
 * `[name, plainSchema]` entries: each schema's resolved subtree when it has
 * been requested (`requestResolvedSubtree`), its raw value otherwise (as
 * oas31's `selectSchemas` does). The array and every schema keep their
 * identity while the underlying Immutable values do, so memoized items do not
 * re-render.
 */
export const selectSchemaEntries = (
  specSelectors: SchemasSpecSelectors,
  dialect: OASDialect
): SchemaEntry[] => {
  const path = getSchemasPath(dialect)
  const specJson = specSelectors.specJson()
  const raw = ImMap.isMap(specJson)
    ? (specJson as ImMap<string, unknown>).getIn(path)
    : undefined
  if (!ImMap.isMap(raw)) return EMPTY_ENTRIES

  const rawSchemas = raw as ImMap<string, unknown>
  const resolvedValue = specSelectors.specResolvedSubtree(path)
  const resolved = ImMap.isMap(resolvedValue)
    ? (resolvedValue as ImMap<string, unknown>)
    : undefined

  const cached = entriesCache.get(rawSchemas)
  if (cached && cached.resolved === resolved) return cached.entries

  const entries: SchemaEntry[] = rawSchemas
    .entrySeq()
    .map(([name, rawSchema]): SchemaEntry => {
      const resolvedSchema = resolved?.get(name)
      return [
        name,
        toPlainSchema(ImMap.isMap(resolvedSchema) ? resolvedSchema : rawSchema),
      ]
    })
    .toArray()

  entriesCache.set(rawSchemas, { resolved, entries })
  return entries
}

/**
 * The named schema `name` of the current document (the 2.0 `definitions` or
 * 3.x `components.schemas` entry), as json-schema-5's
 * `specSelectors.findDefinition` reads it: its resolved subtree when it has
 * been requested, its raw value otherwise; `null` when there is none.
 */
export const findSchemaDefinition = (
  specSelectors: SchemasSpecSelectors,
  dialect: OASDialect,
  name: string
): Schema | null => {
  const path = [...getSchemasPath(dialect), name]
  const resolved = specSelectors.specResolvedSubtree(path)
  if (ImMap.isMap(resolved)) return toPlainSchema(resolved)

  const specJson = specSelectors.specJson()
  const raw = ImMap.isMap(specJson)
    ? (specJson as ImMap<string, unknown>).getIn(path)
    : undefined
  return ImMap.isMap(raw) ? toPlainSchema(raw) : null
}
