/**
 * @prettier
 */
import { createContext } from "react"

export const JSONSchemaContext = createContext(null)
JSONSchemaContext.displayName = "JSONSchemaContext"

export const JSONSchemaLevelContext = createContext(0)
JSONSchemaLevelContext.displayName = "JSONSchemaLevelContext"
