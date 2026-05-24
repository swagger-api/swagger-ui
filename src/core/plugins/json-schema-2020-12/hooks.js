/**
 * @prettier
 */
import { useCallback, useContext, useEffect, useState } from "react"

import {
  JSONSchemaContext,
  JSONSchemaLevelContext,
  JSONSchemaCyclesContext,
  JSONSchemaPathContext,
} from "./context"
import { JSONSchemaIsExpandedState } from "./enum"

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

export const useJSONSchemaContextState = () => {
  const [, setFakeState] = useState(null)
  const { state } = useContext(JSONSchemaContext)
  const setState = (updateFn) => {
    updateFn(state)
    setFakeState({})
  }

  return { state, setState }
}

export const useLevel = () => {
  const level = useContext(JSONSchemaLevelContext)

  return [level, level + 1]
}

export const useIsEmbedded = () => {
  const [level] = useLevel()

  return level > 0
}

export const usePath = (pathToken) => {
  const path = useContext(JSONSchemaPathContext)
  const { setState } = useJSONSchemaContextState()
  const currentPath =
    typeof pathToken === "string" ? [...path, pathToken] : path

  const pathMutator = (value, options = { deep: false }) => {
    const startPath = currentPath.toString()
    const updateFn = (state) => {
      state.paths[startPath] = value

      if (value === JSONSchemaIsExpandedState.Collapsed) {
        Object.keys(state.paths).forEach((key) => {
          if (
            key.startsWith(startPath) &&
            state.paths[key] === JSONSchemaIsExpandedState.DeeplyExpanded
          ) {
            state.paths[key] = JSONSchemaIsExpandedState.Expanded
          }
        })
      }
    }
    const updateDeepFn = (state) => {
      Object.keys(state.paths).forEach((key) => {
        if (key.startsWith(startPath)) {
          state.paths[key] = value
        }
      })
    }

    if (options.deep) {
      setState(updateDeepFn)
    } else {
      setState(updateFn)
    }
  }

  return { path: currentPath, pathMutator }
}

export const useIsExpanded = (name) => {
  const [level] = useLevel()
  const { defaultExpandedLevels } = useConfig()
  const { path, pathMutator } = usePath(name)
  const { path: parentPath } = usePath()
  const { state } = useJSONSchemaContextState()
  const currentState = state.paths[path.toString()]
  const parentState =
    state.paths[parentPath.toString()] ??
    state.paths[parentPath.slice(0, -1).toString()]
  const isExpandedState =
    currentState ??
    (defaultExpandedLevels - level > 0
      ? JSONSchemaIsExpandedState.Expanded
      : JSONSchemaIsExpandedState.Collapsed)
  const isExpanded = isExpandedState !== JSONSchemaIsExpandedState.Collapsed

  useEffect(() => {
    pathMutator(
      parentState === JSONSchemaIsExpandedState.DeeplyExpanded
        ? JSONSchemaIsExpandedState.DeeplyExpanded
        : isExpandedState
    )
  }, [parentState])

  const setExpanded = useCallback((options = { deep: false }) => {
    pathMutator(
      options.deep
        ? JSONSchemaIsExpandedState.DeeplyExpanded
        : JSONSchemaIsExpandedState.Expanded
    )
  }, [])

  const setCollapsed = useCallback((options = { deep: false }) => {
    pathMutator(JSONSchemaIsExpandedState.Collapsed, options)
  }, [])

  return { isExpanded, setExpanded, setCollapsed }
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
