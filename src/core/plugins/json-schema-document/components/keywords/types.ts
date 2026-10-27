/**
 * @prettier
 */
import type React from "react"

export type Schema = Record<string, unknown> | boolean

type Component = React.ComponentType<Record<string, unknown>>

/**
 * What the dialect's keyword components take from the system: the hooks and
 * contexts of the json-schema-2020-12 renderer, reached at runtime (plugins
 * don't import each other).
 */
export interface System {
  fn: {
    jsonSchema202012: {
      useComponent: (name: string) => Component
      useIsExpanded: (name: string) => {
        isExpanded: boolean
        setExpanded: (options?: { deep: boolean }) => void
        setCollapsed: (options?: { deep: boolean }) => void
      }
      usePath: (name?: string) => { path: string[] }
      useLevel: () => [number, number]
    }
  }
  getComponent: (name: string) => unknown
}

export interface KeywordProps {
  schema: Schema
  getSystem: () => System
}
