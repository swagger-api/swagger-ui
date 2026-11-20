/**
 * @prettier
 */
import { useCallback, useContext, useEffect, useRef, useState } from "react"

import {
  JSONSchemaContext,
  JSONSchemaLevelContext,
  JSONSchemaCyclesContext,
  JSONSchemaPathContext,
} from "./context"
import { JSONSchemaIsExpandedState } from "./enum"
import type {
  JSONSchemaConfig,
  JSONSchemaContextValue,
  JSONSchemaFn,
} from "./types"

type ContextState = JSONSchemaContextValue["state"]

export interface ExpansionOptions {
  deep: boolean
}

const COLLAPSED_STATES = [
  JSONSchemaIsExpandedState.Collapsed,
  JSONSchemaIsExpandedState.UserCollapsed,
]

const useJSONSchemaContext = (): JSONSchemaContextValue =>
  useContext(JSONSchemaContext)

export const useConfig = (): JSONSchemaConfig => {
  const { config } = useJSONSchemaContext()
  return config
}

export const useComponent = (componentName: string) => {
  const { components } = useJSONSchemaContext()
  return components[componentName] || null
}

export function useFn(): JSONSchemaFn
export function useFn<K extends keyof JSONSchemaFn>(fnName: K): JSONSchemaFn[K]
export function useFn(fnName: string = undefined) {
  const { fn } = useJSONSchemaContext()

  return typeof fnName !== "undefined" ? fn[fnName] : fn
}

export const useJSONSchemaContextState = () => {
  const [, setFakeState] = useState(null)
  const { state } = useJSONSchemaContext()
  const setState = (updateFn: (state: ContextState) => void) => {
    updateFn(state)
    setFakeState({})
  }

  return { state, setState }
}

export const useLevel = (): [number, number] => {
  const level: number = useContext(JSONSchemaLevelContext)

  return [level, level + 1]
}

export const useIsEmbedded = (): boolean => {
  const [level] = useLevel()

  return level > 0
}

export const usePath = (pathToken?: string) => {
  const path: string[] = useContext(JSONSchemaPathContext)
  const { setState } = useJSONSchemaContextState()
  const currentPath =
    typeof pathToken === "string" ? [...path, pathToken] : path

  const pathMutator = (
    value: string,
    options: ExpansionOptions = { deep: false }
  ) => {
    const startPath = currentPath.toString()
    const updateFn = (state: ContextState) => {
      state.paths[startPath] = value

      if (COLLAPSED_STATES.includes(value)) {
        Object.keys(state.paths).forEach((key) => {
          if (key.startsWith(startPath) && key !== startPath) {
            if (state.paths[key] === JSONSchemaIsExpandedState.DeeplyExpanded) {
              state.paths[key] = JSONSchemaIsExpandedState.Expanded
            } else if (
              state.paths[key] === JSONSchemaIsExpandedState.UserCollapsed
            ) {
              state.paths[key] = JSONSchemaIsExpandedState.Collapsed
            }
          }
        })
      }
    }
    const updateDeepFn = (state: ContextState) => {
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

export const useIsExpanded = (name?: string) => {
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
  const isExpanded = !COLLAPSED_STATES.includes(isExpandedState)
  const prevParentState = useRef(parentState)

  useEffect(() => {
    const hasParentStateChanged = prevParentState.current !== parentState
    prevParentState.current = parentState

    if (
      !hasParentStateChanged &&
      currentState === JSONSchemaIsExpandedState.UserCollapsed
    ) {
      return
    }

    pathMutator(
      parentState === JSONSchemaIsExpandedState.DeeplyExpanded
        ? JSONSchemaIsExpandedState.DeeplyExpanded
        : isExpandedState
    )
  }, [parentState])

  const setExpanded = useCallback(
    (options: ExpansionOptions = { deep: false }) => {
      pathMutator(
        options.deep
          ? JSONSchemaIsExpandedState.DeeplyExpanded
          : JSONSchemaIsExpandedState.Expanded
      )
    },
    []
  )

  const setCollapsed = useCallback(
    (options: ExpansionOptions = { deep: false }) => {
      pathMutator(
        options.deep
          ? JSONSchemaIsExpandedState.Collapsed
          : JSONSchemaIsExpandedState.UserCollapsed,
        options
      )
    },
    []
  )

  return { isExpanded, setExpanded, setCollapsed }
}

export const useRenderedSchemas = (schema: unknown = undefined) => {
  if (typeof schema === "undefined") {
    return useContext(JSONSchemaCyclesContext)
  }

  const renderedSchemas = useContext(JSONSchemaCyclesContext)
  return new Set([...renderedSchemas, schema])
}
export const useIsCircular = (schema: unknown): boolean => {
  const renderedSchemas: Set<unknown> = useRenderedSchemas()
  return renderedSchemas.has(schema)
}
