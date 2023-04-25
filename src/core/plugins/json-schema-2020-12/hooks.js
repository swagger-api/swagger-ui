/**
 * @prettier
 */
import { useContext } from "react"

import {
  JSONSchemaContext,
  JSONSchemaLevelContext,
  JSONSchemaDeepExpansionContext,
  JSONSchemaCyclesContext,
} from "./context"

export const useConfig = () => {
  const { config } = useContext(JSONSchemaContext)
  return config
}

export const useComponent = (componentName) => {
  const { components } = useContext(JSONSchemaContext)
  return components[componentName] || null
}

export const useFn = (fnName = undefined) => {
  const { fn } = useContext(JSONSchemaContext)

  return typeof fnName !== "undefined" ? fn[fnName] : fn
}

export const useLevel = () => {
  const level = useContext(JSONSchemaLevelContext)

  return [level, level + 1]
}

export const useIsEmbedded = () => {
  const [level] = useLevel()

  return level > 0
}

export const useIsExpandedDeeply = () => {
  const [level] = useLevel()
  const { defaultExpandedLevels } = useConfig()
  const isExpandedByDefault = defaultExpandedLevels - level > 0

  return isExpandedByDefault || useContext(JSONSchemaDeepExpansionContext)
}

export const useRenderedSchemas = (schema = undefined) => {
  if (typeof schema === "undefined") {
    return useContext(JSONSchemaCyclesContext)
  }

  const renderedSchemas = useContext(JSONSchemaCyclesContext)
  return new Set([...renderedSchemas, schema])
}
export const useIsCircular = (schema) => {
  const renderedSchemas = useRenderedSchemas()
  return renderedSchemas.has(schema)
}
