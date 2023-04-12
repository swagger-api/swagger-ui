/**
 * @prettier
 */
import { useContext } from "react"

import JSONSchemaContext from "./context"

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
