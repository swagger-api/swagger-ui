/**
 * @prettier
 */
import { useContext } from "react"

import {
  JSONSchemaContext,
  JSONSchemaLevelContext,
  JSONSchemaDeepExpansionContext,
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
  return useContext(JSONSchemaDeepExpansionContext)
}
