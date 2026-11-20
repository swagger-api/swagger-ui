/**
 * @prettier
 */
import { createContext } from "react"

/**
 * This plugin's own contexts; they are never shared with json-schema-2020-12.
 * `JSONSchemaContext` carries a `JSONSchemaContextValue` (see `./types`).
 */
export const JSONSchemaContext = createContext(null)
JSONSchemaContext.displayName = "JSONSchemaUnifiedContext"

export const JSONSchemaLevelContext = createContext(0)
JSONSchemaLevelContext.displayName = "JSONSchemaUnifiedLevelContext"

export const JSONSchemaCyclesContext = createContext(new Set())

export const JSONSchemaPathContext = createContext([])

/**
 * The targets (`LazyRef.key`) of the lazily resolved references on the
 * current branch (2.0/3.0 dialects). A reference to a target already on the
 * branch does not inherit a deep expansion, which bounds "Expand all" on a
 * recursive model.
 */
export const JSONSchemaLazyRefsContext = createContext<ReadonlySet<string>>(
  new Set()
)
