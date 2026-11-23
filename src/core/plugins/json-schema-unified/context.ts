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
